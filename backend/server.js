import express from "express";
import dotenv from "dotenv";
import { pool } from "./db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
const PORT = process.env.PORT || 5000;
dotenv.config();

const app = express();

app.use(
  cors({
    origin: "https://task-management-app-frontend-le16.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/* =========================
   AUTH ROUTES
========================= */
app.get("/api/staff", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM staff ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/staff", async (req, res) => {
  const {
    name,
    email,
    role,
    phone,
    salary,
    dob,
    age,
    start,
    end,
    timings,
    address,
    details,
    photo,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO staff
      (name,email,role,phone,salary,dob,age,start_time,end_time,timings,address,details,photo)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING *`,
      [
        name,
        email,
        role,
        phone,
        salary,
        calculateAge(dob),
        age || null,
        start || null,
        end || null,
        makeTimings(start, end),
        address || null,
        details || null,
        photo || null,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/staff/:id", async (req, res) => {
  const { id } = req.params;
  const staff = req.body;

  try {
    const result = await pool.query(
      `UPDATE staff SET
        name=$1,email=$2,role=$3,phone=$4,salary=$5,
        dob=$6,age=$7,start_time=$8,end_time=$9,
        timings=$10,address=$11,details=$12,photo=$13
       WHERE id=$14 RETURNING *`,
      [
        staff.name,
        staff.email,
        staff.role,
        staff.phone,
        staff.salary,
        staff.dob,
        staff.age,
        staff.start,
        staff.end,
        staff.timings,
        staff.address,
        staff.details,
        staff.photo,
        id,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/staff/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM staff WHERE id=$1", [req.params.id]);
    res.json({ message: "Staff deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/attendance", async (req, res) => {
  const { staffId, date, status } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO attendance (staff_id, date, status)
      VALUES ($1, $2::date, $3)
      ON CONFLICT (staff_id, date)
      DO UPDATE SET status = EXCLUDED.status
      RETURNING *
      `,
      [staffId, date, status]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Attendance error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/attendance", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM attendance");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/attendance", async (req, res) => {
  const { staffId, date, status } = req.body;

  try {
    const existing = await pool.query(
      "SELECT * FROM attendance WHERE staff_id=$1",
      [staffId]
    );

    if (existing.rows.length) {
      const result = await pool.query(
        "UPDATE attendance SET status=$1, date=$2 WHERE staff_id=$3 RETURNING *",
        [status, date, staffId]
      );
      res.json(result.rows[0]);
    } else {
      const result = await pool.query(
        "INSERT INTO attendance (staff_id,date,status) VALUES ($1,$2,$3) RETURNING *",
        [staffId, date, status]
      );
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/categories", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        title,
        icon,
        description,
        highlight,
        menu_type,
        count
      FROM categories
      ORDER BY id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/categories", async (req, res) => {
  try {
    const { title, icon, description, highlight, menu_type } = req.body;

    const result = await pool.query(
      `INSERT INTO categories (title, icon, description, highlight, menu_type)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [title, icon, description, highlight, menu_type]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/categories/:id", async (req, res) => {
  try {
    const { title, icon, description, highlight, menu_type } = req.body;

    await pool.query(
      `UPDATE categories
       SET title=$1, icon=$2, description=$3, highlight=$4, menu_type=$5
       WHERE id=$6`,
      [title, icon, description, highlight, menu_type, req.params.id]
    );

    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/categories/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM categories WHERE id=$1", [req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/menu-items", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        m.id,
        m.name AS product,
        m.description AS desc,
        m.item_code AS "itemId",
        m.stock,
        m.price,
        m.availability,
        c.title AS category
      FROM menu_items m
      JOIN categories c ON c.id = m.category_id
      ORDER BY m.id
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("menu-items error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* CREATE menu item */
app.post("/api/menu-items", async (req, res) => {
  try {
    const {
      product,
      desc,
      itemId,
      stock,
      category,
      price,
      availability,
      image,
    } = req.body;

    const cat = await pool.query("SELECT id FROM categories WHERE name=$1", [
      category,
    ]);

    await pool.query(
      `INSERT INTO menu_items
       (name, description, item_code, stock, category_id, price, availability, image)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        product,
        desc,
        itemId,
        parseInt(stock),
        cat.rows[0].id,
        parseFloat(price.replace("$", "")),
        availability,
        image,
      ]
    );

    res.sendStatus(201);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* UPDATE menu item */
app.put("/api/menu-items/:id", async (req, res) => {
  try {
    const { product, desc, stock, price, availability } = req.body;

    await pool.query(
      `UPDATE menu_items
       SET name=$1, description=$2, stock=$3, price=$4, availability=$5
       WHERE id=$6`,
      [product, desc, stock, price, availability, req.params.id]
    );

    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* DELETE menu item */
app.delete("/api/menu-items/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM menu_items WHERE id=$1", [req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/register", async (req, res) => {
  const { name, email, password, role = "user" } = req.body;

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
             VALUES ($1, $2, $3, $4)
             RETURNING id, email, role`,
      [name, email, hashedPassword, role]
    );

    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

/* =========================
   MIDDLEWARE
========================= */

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

/* =========================
   CATEGORY & MENU ROUTES
========================= */

/**
 * GET ALL CATEGORIES
 */
app.get("/categories", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, icon, count as items_count
             FROM categories
             ORDER BY id`
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

/**
 * GET MENU ITEMS BY CATEGORY ID
 */
app.get("/menu-items/:categoryId", async (req, res) => {
  const { categoryId } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, name, price
             FROM menu_items
             WHERE category_id = $1
             ORDER BY id`,
      [categoryId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch menu items" });
  }
});
app.post("/orders", authenticate, async (req, res) => {
  const {
    customerId,
    customerName,
    tableNumber,
    items,
    subtotal,
    tax,
    total,
    status,
  } = req.body;

  try {
    const orderResult = await pool.query(
      `INSERT INTO orders
       (customer_id, customer_name, table_number, status, subtotal, tax, total)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING id`,
      [customerId, customerName, tableNumber, status, subtotal, tax, total]
    );

    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      await pool.query(
        `INSERT INTO order_items
         (order_id, menu_item_id, name, price, quantity)
         VALUES ($1,$2,$3,$4,$5)`,
        [orderId, item.menuItemId, item.name, item.price, item.quantity]
      );
    }

    res.status(201).json({ message: "Order sent to kitchen" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order creation failed" });
  }
});
app.get("/orders", authenticate, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.*,
        COALESCE(
          json_agg(oi.*) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});
app.get("/profile", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

app.put("/profile", authenticate, async (req, res) => {
  const { name, email } = req.body;

  try {
    await pool.query("UPDATE users SET name = $1, email = $2 WHERE id = $3", [
      name,
      email,
      req.user.id,
    ]);

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});
app.put("/profile/password", authenticate, async (req, res) => {
  const { password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
      hashedPassword,
      req.user.id,
    ]);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update password" });
  }
});
app.get("/dashboard", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        name,
        price,
        stock
      FROM inventory
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
});
//Inventory
app.get("/inventory", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM inventory ORDER BY id DESC");

    // format stock like frontend expects
    const data = result.rows.map((item) => ({
      ...item,
      stock: `${item.quantity} In Stock`,
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ADD INVENTORY */
app.post("/inventory", async (req, res) => {
  const { name, category, price, quantity, status, perishable, image } =
    req.body;

  try {
    const result = await pool.query(
      `INSERT INTO inventory 
       (name, category, price, quantity, status, perishable, image)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [name, category, price, quantity, status, perishable, image]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Insert failed" });
  }
});

/* UPDATE INVENTORY */
app.put("/inventory/:id", async (req, res) => {
  const { id } = req.params;
  const { name, category, price, quantity, status, perishable, image } =
    req.body;

  try {
    const result = await pool.query(
      `UPDATE inventory
       SET name=$1, category=$2, price=$3, quantity=$4,
           status=$5, perishable=$6, image=$7
       WHERE id=$8
       RETURNING *`,
      [name, category, price, quantity, status, perishable, image, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
});

/* DELETE INVENTORY */
app.delete("/inventory/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM inventory WHERE id=$1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
});

/* =========================
   SERVER START
========================= */
/* DELETE ORDER */
app.delete("/orders/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    // delete order items first (FK safety)
    await pool.query("DELETE FROM order_items WHERE order_id = $1", [id]);

    // delete order
    const result = await pool.query(
      "DELETE FROM orders WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete order" });
  }
});
app.listen(PORT, () => {
  console.log(`🚀 Server Started at ${PORT}`);
});
