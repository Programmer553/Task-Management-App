import { useState, useEffect, useRef } from "react";
import {
  User,
  Settings,
  LogOut,
  Pencil,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import john from "../assets/john.svg";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [users, setUsers] = useState([
    {
      name: "Abubakar Sherazi",
      email: "abubakarsherazi@gmail.com",
      role: "Admin",
      permissions: {
        Dashboard: true,
        Reports: true,
        Inventory: true,
        Orders: true,
        Customers: true,
        Settings: true,
      },
    },
    {
      name: "Anees Ansari",
      email: "aneesansari@gmail.com",
      role: "Sub admin",
      permissions: {
        Dashboard: false,
        Reports: true,
        Inventory: true,
        Orders: true,
        Customers: false,
        Settings: true,
      },
    },
  ]);

  function addUser(newUser) {
    setUsers((prev) => [newUser, ...prev]);
    setActiveTab("access");
  }

  function deleteUser(index) {
    setUsers((prev) => prev.filter((_, i) => i !== index));
  }

  function updateUser(index, updated) {
    setUsers((prev) => prev.map((u, i) => (i === index ? updated : u)));
  }

  function togglePermission(index, key) {
    setUsers((prev) =>
      prev.map((u, i) =>
        i !== index
          ? u
          : {
              ...u,
              permissions: { ...u.permissions, [key]: !u.permissions[key] },
            }
      )
    );
  }
  return (
    <div className="min-h-screen bg-[#050608] text-white">
      <div className="container mx-4 px-4 lg:px-6 py-4">
        <div className="md:hidden flex items-center justify-center gap-3 mb-4 mt-4">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === "profile"
                ? "bg-[#FAC1D9] text-[#171717]"
                : "bg-[#292C2D] text-white"
            }`}
          >
            Profile
          </button>

          <button
            onClick={() => setActiveTab("access")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === "access"
                ? "bg-[#FAC1D9] text-[#171717]"
                : "bg-[#292C2D] text-white"
            }`}
          >
            Access
          </button>
        </div>

        <div className="flex gap-6 items-start">
          <aside className="hidden md:flex w-[320px] flex-col shrink-0">
            <div className="bg-[#292C2D] rounded-2xl p-5 space-y-3">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 font-medium cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-[#FAC1D9] text-[#171717]"
                    : "text-white hover:bg-[#363A3B]"
                }`}
              >
                <User size={16} /> My Profile
              </button>

              <button
                onClick={() => setActiveTab("access")}
                className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 font-medium cursor-pointer ${
                  activeTab === "access"
                    ? "bg-[#FAC1D9] text-[#171717]"
                    : "text-white hover:bg-[#363A3B]"
                }`}
              >
                <Settings size={16} /> Manage Access
              </button>

              <button
                className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-white hover:bg-[#363A3B] cursor-pointer"
                onClick={() => {
                  navigate("/login");
                }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>

            {activeTab === "access" ? (
              <div className="mt-6 flex-grow">
                <AddUserCard onAdd={addUser} />
              </div>
            ) : null}
          </aside>

          <main className="flex-1 w-full">
            {activeTab === "profile" ? (
              <ProfileInfo />
            ) : (
              <ManageAccess
                users={users}
                onToggle={togglePermission}
                onDelete={deleteUser}
                onUpdate={updateUser}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
function AddUserCard({ onAdd }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  function handleAdd(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !role.trim()) return;

    const newUser = {
      name: name.trim(),
      email: email.trim(),
      role: role.trim(),
      permissions: {
        Dashboard: false,
        Reports: false,
        Inventory: false,
        Orders: false,
        Customers: false,
        Settings: false,
      },
    };

    onAdd(newUser);
    setName("");
    setEmail("");
    setRole("");
    setPassword("");
  }

  return (
    <form
      className="bg-[#292C2D] rounded-2xl p-6 space-y-4"
      onSubmit={handleAdd}
    >
      <h2 className="text-[16px] font-semibold">Add New User</h2>

      <PlainInput placeholder="First Name" value={name} onChange={setName} />
      <PlainInput placeholder="Email" value={email} onChange={setEmail} />
      <PlainInput placeholder="Role" value={role} onChange={setRole} />

      <div className="flex items-center rounded-md bg-[#3D4142] px-3 py-2">
        <input
          type={show ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-transparent outline-none w-full text-sm text-white"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="ml-3 cursor-pointer"
        >
          {show ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </div>

      <button className="w-full bg-[#FAC1D9] text-[#171717] rounded-xl py-2.5 text-sm font-medium cursor-pointer">
        Add
      </button>
    </form>
  );
}
function ProfileInfo() {
  const [avatar, setAvatar] = useState(john);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:5000/profile", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFirstName(data.name);
        setEmail(data.email);
      })
      .catch(() => {});
  }, []);

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        setSaveMessage("Passwords do not match.");
        return;
      }
    }

    await fetch("http://localhost:5000/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name: firstName,
        email: email,
      }),
    });

    if (password) {
      await fetch("http://localhost:5000/profile/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ password }),
      });
    }

    setPassword("");
    setConfirmPassword("");
    setSaveMessage("Changes saved successfully!");
  }

  function handleDiscard() {
    setAvatar(initialData.avatar);
    setFirstName(initialData.firstName);
    setEmail(initialData.email);
    setAddress(initialData.address);
    setPassword(initialData.password);
    setConfirmPassword(initialData.password);
  }

  return (
    <div className="bg-[#292C2D] rounded-3xl px-6 py-8 w-full">
      <h2 className="text-[22px] font-semibold mb-6">Personal Information</h2>

      <div className="flex items-center gap-6 mb-6">
        <div className="relative w-20 h-20">
          <img
            src={avatar}
            className="w-full h-full rounded-full object-cover cursor-pointer"
            alt="profile"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute -right-1 -bottom-1 w-7 h-7 rounded-full bg-[#FAC1D9] flex items-center justify-center cursor-pointer"
          >
            <Pencil size={12} className="text-[#171717]" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        <div>
          <p className="text-2xl font-semibold">{firstName}</p>
          <p className="text-base text-[#FAC1D9]">Manager</p>
        </div>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Input label="First Name" value={firstName} onChange={setFirstName} />
        <Input label="Email" value={email} onChange={setEmail} />
        <Input label="Address" value={address} onChange={setAddress} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PasswordInput
            label="New Password"
            value={password}
            onChange={setPassword}
            show={showPassword}
            toggle={() => setShowPassword(!showPassword)}
          />
          <PasswordInput
            label="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={showConfirmPassword}
            toggle={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        </div>

        <div className="flex justify-end gap-4 pt-2 ">
          <button
            type="button"
            onClick={handleDiscard}
            className="underline text-sm cursor-pointer"
          >
            Discard Changes
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 rounded-xl bg-[#FAC1D9] text-[#171717] font-medium cursor-pointer"
          >
            Save Changes
          </button>
        </div>

        {saveMessage && (
          <p className="text-[#FAC1D9] text-right mt-2 text-sm">
            {saveMessage}
          </p>
        )}
      </form>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-[14px] mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-[#3D4142] px-4 py-3 text-sm outline-none text-white"
      />
    </div>
  );
}

function PasswordInput({ label, value, onChange, show, toggle }) {
  return (
    <div>
      <label className="block text-[14px] mb-1">{label}</label>

      <div className="flex items-center bg-[#3D4142] rounded-lg px-3 py-2">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent outline-none w-full text-sm"
        />
        <button type="button" onClick={toggle} className="ml-2 cursor-pointer">
          {show ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </div>
    </div>
  );
}
function ManageAccess({ users, onToggle, onDelete, onUpdate }) {
  const permOrder = [
    "Dashboard",
    "Reports",
    "Inventory",
    "Orders",
    "Customers",
    "Settings",
  ];
  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "",
    permissions: {},
  });

  function openEdit(i) {
    setEditingIndex(i);
    setEditForm({ ...users[i] });
  }

  function closeEdit() {
    setEditingIndex(null);
    setEditForm({ name: "", email: "", role: "", permissions: {} });
  }

  function saveEdit() {
    onUpdate(editingIndex, editForm);
    closeEdit();
  }

  return (
    <div className="bg-[#292C2D] rounded-3xl p-6 space-y-6 relative w-full ">
      {users.map((user, index) => (
        <div key={user.email}>
          {index !== 0 && <hr className="border-[#3D4142] my-4 " />}
          <UserBlock
            user={user}
            index={index}
            permOrder={permOrder}
            onToggle={onToggle}
            onDelete={() => onDelete(index)}
            onEdit={() => openEdit(index)}
          />
        </div>
      ))}

      {editingIndex !== null && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-[#1F2021] p-6 rounded-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3 ">Edit User</h3>

            <div className="space-y-3">
              <Input
                label="Name"
                value={editForm.name}
                onChange={(val) => setEditForm({ ...editForm, name: val })}
              />
              <Input
                label="Email"
                value={editForm.email}
                onChange={(val) => setEditForm({ ...editForm, email: val })}
              />
              <Input
                label="Role"
                value={editForm.role}
                onChange={(val) => setEditForm({ ...editForm, role: val })}
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-3 py-2 border rounded-md cursor-pointer"
                onClick={closeEdit}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 bg-[#FAC1D9] text-[#171717] rounded-md cursor-pointer"
                onClick={saveEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PlainInput({ placeholder, value, onChange }) {
  return (
    <input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md bg-[#3D4142] px-4 py-3 text-sm text-white outline-none placeholder:text-[#9CA3AF]"
    />
  );
}

function UserBlock({ user, index, permOrder, onToggle, onDelete, onEdit }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xl font-semibold">{user.name}</p>
          <p className="text-sm text-[#FAC1D9]">{user.email}</p>
        </div>

        <div className="flex gap-2 ">
          <button onClick={onEdit}>
            <Pencil size={16} className="cursor-pointer" />
          </button>
          <button onClick={onDelete}>
            <Trash2 size={16} className="text-red-400 cursor-pointer" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {permOrder.map((key) => (
          <div key={key}>
            <p className="text-sm mb-1">{key}</p>
            <TogglePill
              on={user.permissions[key]}
              onClick={() => onToggle(index, key)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function TogglePill({ on, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-5 rounded-full flex items-center px-1 transition-colors cursor-pointer ${
        on ? "bg-[#FAC1D9]" : "bg-[#3D4142]"
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full transition-transform ${
          on ? "translate-x-4 bg-[#171717]" : "translate-x-0 bg-[#FAC1D9]"
        }`}
      />
    </button>
  );
}
