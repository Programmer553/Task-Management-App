import React, { useState, useRef, useEffect, useMemo } from "react";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
function useId(start = 1000) {
  const ref = useRef(start);
  return () => ++ref.current;
}

function Avatar({ src, name, size = 8 }) {
  const px = `${size * 4}px`;
  return (
    <div
      style={{ width: px, height: px }}
      className="rounded-full overflow-hidden bg-gray-700 flex items-center justify-center"
    >
      {src ? (
        <img
          src={src}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-xs text-pink-200">{name?.[0] ?? "U"}</span>
      )}
    </div>
  );
}

function IconEye() {
  return (
    <svg
      className="cursor-pointer"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11" cy="11" r="11" fill="#FAC1D9" />
      <path
        d="M11.0002 9.25C10.536 9.25 10.0909 9.43437 9.76273 9.76256C9.43454 10.0908 9.25016 10.5359 9.25016 11C9.25016 11.4641 9.43454 11.9092 9.76273 12.2374C10.0909 12.5656 10.536 12.75 11.0002 12.75C11.4643 12.75 11.9094 12.5656 12.2376 12.2374C12.5658 11.9092 12.7502 11.4641 12.7502 11C12.7502 10.5359 12.5658 10.0908 12.2376 9.76256C11.9094 9.43437 11.4643 9.25 11.0002 9.25ZM11.0002 13.9167C10.2266 13.9167 9.48475 13.6094 8.93777 13.0624C8.39079 12.5154 8.0835 11.7735 8.0835 11C8.0835 10.2265 8.39079 9.48459 8.93777 8.93761C9.48475 8.39062 10.2266 8.08333 11.0002 8.08333C11.7737 8.08333 12.5156 8.39062 13.0626 8.93761C13.6095 9.48459 13.9168 10.2265 13.9168 11C13.9168 11.7735 13.6095 12.5154 13.0626 13.0624C12.5156 13.6094 11.7737 13.9167 11.0002 13.9167ZM11.0002 6.625C8.0835 6.625 5.59266 8.43917 4.5835 11C5.59266 13.5608 8.0835 15.375 11.0002 15.375C13.9168 15.375 16.4077 13.5608 17.4168 11C16.4077 8.43917 13.9168 6.625 11.0002 6.625Z"
        fill="#333333"
      />
    </svg>
  );
}
function IconEdit() {
  return (
    <svg
      className="cursor-pointer"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.66211 15.7736V17.8755C3.66211 17.9971 3.7104 18.1136 3.79635 18.1996C3.88231 18.2856 3.99889 18.3338 4.12044 18.3338H6.22694C6.34827 18.3338 6.46463 18.2857 6.55053 18.2L15.2112 9.53935L12.4612 6.78935L3.79686 15.45C3.71084 15.5358 3.66238 15.6521 3.66211 15.7736ZM13.596 5.6536L16.346 8.4036L17.6844 7.06526C17.8562 6.89336 17.9527 6.66025 17.9527 6.41718C17.9527 6.17411 17.8562 5.941 17.6844 5.7691L16.2314 4.31526C16.0595 4.14341 15.8264 4.04687 15.5834 4.04688C15.3403 4.04687 15.1072 4.14341 14.9353 4.31526L13.596 5.6536Z"
        fill="white"
      />
    </svg>
  );
}
function IconTrash() {
  return (
    <svg
      className="cursor-pointer"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.98009 18.3308C6.55842 18.3308 6.20642 18.1897 5.92409 17.9073C5.64115 17.6244 5.49967 17.2721 5.49967 16.8504V5.4975H4.58301V4.58083H8.24967V3.875H13.7497V4.58083H17.4163V5.4975H16.4997V16.8504C16.4997 17.2721 16.3585 17.6241 16.0762 17.9064C15.7932 18.1894 15.4409 18.3308 15.0193 18.3308H6.98009ZM8.99034 15.5808H9.90701V7.33083H8.99034V15.5808ZM12.0923 15.5808H13.009V7.33083H12.0923V15.5808Z"
        fill="#E70000"
      />
    </svg>
  );
}

const STAFF_GRID =
  "grid-cols-[40px_70px_minmax(160px,1.5fr)_minmax(200px,2fr)_minmax(120px,1fr)_70px_minmax(90px,1fr)_minmax(110px,1fr)_98px]";

const ATTENDANCE_GRID = "grid-cols-[40px_80px_260px_160px_1fr_160px]";

export default function StaffManagement() {
  const [tab, setTab] = useState("staff");
  const [staff, setStaff] = useState([]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [detailView, setDetailView] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [loading, setLoading] = useState(true);

  const [attendanceData, setAttendanceData] = useState(() =>
    staff.map((s) => ({
      staffId: s.id,
      date: new Date().toISOString().split("T")[0],

      status: "",
    }))
  );

  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  useEffect(() => {
    async function loadStaff() {
      setLoading(true);
      try {
        const res = await fetch(`${API}/api/staff`);
        const data = await res.json();

        setStaff(
          data.map((s) => ({
            ...s,
            start: s.start_time,
            end: s.end_time,
          }))
        );
      } catch (err) {
        console.error(err);
        setStaff([]);
      } finally {
        setLoading(false);
      }
    }

    loadStaff();
  }, []);

  useEffect(() => {
    fetch(`${API}/api/attendance`)
      .then((r) => r.json())
      .then((data) =>
        setAttendanceData(
          data.map((a) => ({
            staffId: a.staff_id,
            date: a.date,
            status: a.status,
          }))
        )
      );
  }, []);

  function parseAge(a) {
    if (!a) return NaN;
    const m = ("" + a).match(/(\d+)/);
    return m ? parseInt(m[1], 10) : NaN;
  }
  function parseSalary(s) {
    if (!s) return NaN;
    const cleaned = ("" + s).replace(/[^0-9.]/g, "");
    return cleaned ? parseFloat(cleaned) : NaN;
  }

  function compareStaff(a, b) {
    let A, B;
    switch (sortBy) {
      case "name":
        A = (a.name || "").toLowerCase();
        B = (b.name || "").toLowerCase();
        return A.localeCompare(B);
      case "role":
        A = (a.role || "").toLowerCase();
        B = (b.role || "").toLowerCase();
        return A.localeCompare(B);
      case "age":
        A = parseAge(a.age);
        B = parseAge(b.age);
        if (isNaN(A) && isNaN(B)) return 0;
        if (isNaN(A)) return 1;
        if (isNaN(B)) return -1;
        return A - B;
      case "salary":
        A = parseSalary(a.salary);
        B = parseSalary(b.salary);
        if (isNaN(A) && isNaN(B)) return 0;
        if (isNaN(A)) return 1;
        if (isNaN(B)) return -1;
        return A - B;
      case "timings":
        A = (a.timings || "").toLowerCase();
        B = (b.timings || "").toLowerCase();
        return A.localeCompare(B);
      case "id":
      default:
        return (a.id || 0) - (b.id || 0);
    }
  }

  const sortedStaff = useMemo(() => {
    if (!staff.length) return [];
    const copy = [...staff];
    copy.sort((a, b) => {
      let A = a[sortBy] || "";
      let B = b[sortBy] || "";
      return sortOrder === "asc"
        ? String(A).localeCompare(String(B))
        : String(B).localeCompare(String(A));
    });
    return copy;
  }, [staff, sortBy, sortOrder]);

  function computeAgeFromDob(dob) {
    if (!dob) return "";
    const d = new Date(dob);
    if (isNaN(d.getTime())) {
      const parts = dob.split(/[-\/]/).map((p) => p.trim());
      if (parts.length === 3) {
        const [a, b, c] = parts;
        let dd = a,
          mm = b,
          yyyy = c;
        if (a.length === 4) {
          yyyy = a;
          mm = b;
          dd = c;
        }
        const tryDate = new Date(`${yyyy}-${mm}-${dd}`);
        if (!isNaN(tryDate.getTime()))
          return (
            Math.abs(new Date().getUTCFullYear() - tryDate.getUTCFullYear()) +
            " yr"
          );
        return "";
      }
      return "";
    }
    const yearDiff = new Date().getUTCFullYear() - d.getUTCFullYear();
    return `${yearDiff} yr`;
  }

  async function onSaveStaff(payload) {
    const method = payload.id ? "PUT" : "POST";
    const url = payload.id
      ? `${API}/api/staff/${payload.id}`
      : `${API}/api/staff`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await fetch(`${API}/api/staff`);
    const freshStaff = await res.json();
    setStaff(freshStaff);

    setDrawerOpen(false);
    setEditing(null);
  }

  async function onDelete(s) {
    if (!confirm(`Delete ${s.name}?`)) return;

    await fetch(`${API}/api/staff/${s.id}`, { method: "DELETE" });
    setStaff((xs) => xs.filter((x) => x.id !== s.id));
    setDetailView(null);
  }

  async function toggleAttendance(staffId, status) {
    const payload = {
      staffId,
      date: new Date().toISOString().split("T")[0], // ✅ FIXED
      status,
    };

    await fetch(`${API}/api/attendance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setAttendanceData((prev) => {
      const exists = prev.find(
        (a) => a.staffId === staffId && a.date === payload.date
      );

      if (exists) {
        return prev.map((a) =>
          a.staffId === staffId && a.date === payload.date
            ? { ...a, status }
            : a
        );
      }

      return [{ staffId, date: payload.date, status }, ...prev];
    });
  }

  function StaffForm({ initial = {}, onCancel, onConfirm }) {
    const [form, setForm] = useState({
      id: initial.id,
      name: initial.name || "",
      email: initial.email || "",
      role: initial.role || "Waiter",
      phone: initial.phone || "",
      salary: initial.salary || "",
      dob: initial.dob || "",
      start: initial.start || "",
      end: initial.end || "",
      address: initial.address || "",
      details: initial.details || "",
      photo: initial.photo || "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
      setForm({
        id: initial.id,
        name: initial.name || "",
        email: initial.email || "",
        role: initial.role || "Waiter",
        phone: initial.phone || "",
        salary: initial.salary || "",
        dob: initial.dob || "",
        start: initial.start || "",
        end: initial.end || "",
        address: initial.address || "",
        details: initial.details || "",
        photo: initial.photo || "",
      });
      setErrors({});
    }, [initial]);

    function handleFile(e) {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => setForm((f) => ({ ...f, photo: reader.result }));
      reader.readAsDataURL(file);
    }

    function validate() {
      const err = {};
      if (!form.name || form.name.trim().length < 2)
        err.name = "Please enter a valid name";
      if (!form.email || !form.email.includes("@"))
        err.email = "Please enter a valid email";
      return err;
    }

    function submit() {
      const v = validate();
      setErrors(v);
      if (Object.keys(v).length) return;
      const payload = {
        ...form,
        age: computeAgeFromDob(form.dob),
        timings: form.start && form.end ? `${form.start} - ${form.end}` : null,
      };

      onConfirm(payload);
    }

    return (
      <div className="p-6 text-sm font-[Poppins]">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          {form.id ? "Edit Staff" : "Add Staff"}
        </h3>

        <div className="space-y-4">
          <div className="flex flex-col items-start gap-2">
            <div className="w-28 h-28 bg-[#292C2D] rounded-lg overflow-hidden flex items-center justify-center">
              {form.photo ? (
                <img
                  src={form.photo}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-pink-200">No Image</div>
              )}
            </div>

            <label className="text-[#FAC1D9] underline text-sm cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />
              Change Profile Picture
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-300">Full Name</label>
              <input
                autoFocus
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full p-3 bg-[#3D4142] rounded text-gray-200"
                placeholder="Enter full name"
              />
              {errors.name && (
                <div className="text-xs text-red-400 mt-1">{errors.name}</div>
              )}
            </div>

            <div>
              <label className="text-xs text-gray-300">Email</label>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full p-3 bg-[#3D4142] rounded text-gray-200"
                placeholder="Enter email address"
              />
              {errors.email && (
                <div className="text-xs text-red-400 mt-1">{errors.email}</div>
              )}
            </div>

            <div>
              <label className="text-xs text-gray-300">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="mt-1 w-full p-3 bg-[#3D4142] rounded text-gray-200"
              >
                <option>Manager</option>
                <option>Chef</option>
                <option>Waiter</option>
                <option>Cleaner</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-300">Phone number</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1 w-full p-3 bg-[#3D4142] rounded text-gray-200"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300">Salary</label>
              <input
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                className="mt-1 w-full p-3 bg-[#3D4142] rounded text-gray-200"
                placeholder="Enter Salary"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300">Date of birth</label>

              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 2V5M17 2V5M3 9H21M5 5H19C20.1046 5 21 5.89543 21 7V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V7C3 5.89543 3.89543 5 5 5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <input
                  type="date"
                  value={form.dob || ""}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  className="w-full p-3 pl-10 bg-[#3D4142] rounded text-gray-200
                 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FAC1D9]"
                  max={new Date().toISOString().split("T")[0]} // prevent future dates
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-300">
                Shift start timing
              </label>

              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M12 7V12L15 14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <input
                  type="time"
                  value={form.start || ""}
                  onChange={(e) => setForm({ ...form, start: e.target.value })}
                  className="w-full p-3 pl-10 bg-[#3D4142] rounded text-gray-200
                 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FAC1D9]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-300">Shift end timing</label>

              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M12 7V12L15 14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <input
                  type="time"
                  value={form.end || ""}
                  onChange={(e) => setForm({ ...form, end: e.target.value })}
                  className="w-full p-3 pl-10 bg-[#3D4142] rounded text-gray-200
                 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FAC1D9]"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-gray-300">Address</label>
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="mt-1 w-full p-3 bg-[#3D4142] rounded text-gray-200"
                placeholder="Enter address"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-gray-300">
                Additional details
              </label>
              <textarea
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                rows={4}
                className="mt-1 w-full p-3 bg-[#3D4142] rounded text-gray-200"
                placeholder="Enter additional details"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-4">
            <label
              className="px-4 py-2 underline text-sm cursor-pointer"
              onClick={() => {
                onCancel();
              }}
            >
              Cancel
            </label>
            <button
              onClick={submit}
              className="px-4 py-2 rounded bg-[#FAC1D9] text-gray-900 cursor-pointer"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }

  function StaffRow({ s, index }) {
    return (
      <div className="w-full">
        <div
          className={`w-full rounded-lg px-3 sm:px-4 py-4 ${
            index % 2 === 0 ? "bg-[#292C2D]" : "bg-[#3D4142]"
          }`}
        >
          <div
            className={`
            hidden lg:grid
            ${STAFF_GRID}
            
            gap-3 items-center w-full
          `}
          >
            <div className="flex items-center">
              <input type="checkbox" className="accent-pink-300" />
            </div>

            <div className="text-xs text-gray-300 truncate">#{s.id}</div>

            <div className="flex items-center gap-3 min-w-0">
              <Avatar src={s.photo} name={s.name} size={12} />
              <div className="min-w-0">
                <div className="font-semibold text-gray-100 truncate">
                  {s.name}
                </div>
                <div className="text-xs text-gray-400 truncate">{s.role}</div>
              </div>
            </div>

            <div className="text-sm text-gray-300 truncate">{s.email}</div>
            <div className="text-sm text-gray-300 truncate">{s.phone}</div>
            <div className="text-sm text-gray-300">{s.age}</div>
            <div className="text-sm text-gray-300">{s.salary}</div>
            <div className="text-sm text-gray-300 truncate">{s.timings}</div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDetailView(s)}
                className="p-2 rounded hover:bg-[#3b465a]"
              >
                <IconEye />
              </button>

              <button
                onClick={() => {
                  setEditing(s);
                  setFormKey((k) => k + 1);
                  setDrawerOpen(true);
                }}
                className="p-2 rounded hover:bg-[#3b465a]"
              >
                <IconEdit />
              </button>

              <button
                onClick={() => onDelete(s)}
                className="p-2 rounded hover:bg-red-600/30"
              >
                <IconTrash />
              </button>
            </div>
          </div>

          <div className="lg:hidden flex flex-col gap-3 w-full">
            <div className="flex items-center gap-3">
              <Avatar src={s.photo} name={s.name} size={10} />
              <div className="min-w-0">
                <div className="font-semibold text-gray-100 truncate">
                  {s.name}
                </div>
                <div className="text-xs text-gray-400 truncate">{s.role}</div>
              </div>
            </div>

            <MobileField label="ID" value={`#${s.id}`} />
            <MobileField label="Email" value={s.email} />
            <MobileField label="Phone" value={s.phone} />

            <div className="grid grid-cols-2 gap-3">
              <MobileField label="Age" value={s.age} />
              <MobileField label="Salary" value={s.salary} />
            </div>

            <MobileField label="Timings" value={s.timings} />

            <div className="flex justify-center gap-6 pt-2">
              <ActionBtn onClick={() => setDetailView(s)}>
                <IconEye />
              </ActionBtn>
              <ActionBtn
                onClick={() => {
                  setEditing(s);
                  setFormKey((k) => k + 1);
                  setDrawerOpen(true);
                }}
              >
                <IconEdit />
              </ActionBtn>
              <ActionBtn onClick={() => onDelete(s)}>
                <IconTrash />
              </ActionBtn>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function MobileField({ label, value }) {
    return (
      <div className="text-sm text-gray-300">
        <div className="text-xs text-gray-400">{label}</div>
        <div className="truncate">{value}</div>
      </div>
    );
  }

  function ActionBtn({ children, onClick }) {
    return (
      <button
        onClick={onClick}
        className="p-3 rounded bg-[#282a2b] hover:bg-[#343536]"
      >
        {children}
      </button>
    );
  }

  function AttendanceRow({ s, idx }) {
    const [expanded, setExpanded] = useState(false);
    const att = attendanceData.find((a) => a.staffId === s.id) || {
      date: new Date().toISOString().split("T")[0],
      status: "",
    };
    const status = att.status;

    function pillClass(st) {
      if (st === "Present") return "bg-[#FAC1D9] text-gray-900";
      if (st === "Absent") return "bg-yellow-300 text-gray-900";
      if (st === "Half Shift") return "bg-sky-300 text-gray-900";
      if (st === "Leave") return "bg-red-400 text-white";
      return "bg-gray-600 text-white";
    }

    return (
      <div className="w-full">
        <div
          className={`hidden lg:grid ${ATTENDANCE_GRID} items-center px-4 py-3 rounded-lg ${
            idx % 2 === 0 ? "bg-[#292C2D]" : "bg-[#3D4142]"
          }`}
        >
          <div className="flex justify-center">{/* placeholder */}</div>

          <div className="text-xs text-gray-300">#{s.id}</div>

          <div className="flex items-center gap-3 min-w-0">
            <Avatar src={s.photo} name={s.name} size={12} />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-100 truncate">
                {s.name}
              </div>
              <div className="text-xs text-gray-400">{s.role}</div>
            </div>
          </div>

          <div className="text-sm text-gray-300">{att.date}</div>

          <div className="text-sm text-gray-300 truncate">{s.timings}</div>

          <div className="flex items-center justify-end gap-2">
            {status ? (
              <div className="flex items-center gap-3">
                <div
                  className={`inline-block px-4 py-2 rounded whitespace-nowrap  ${pillClass(
                    status
                  )}`}
                >
                  {status}
                </div>
                <button
                  onClick={() => toggleAttendance(s.id, "")}
                  title="Edit Attendance"
                  className="p-2 rounded bg-gray-800 hover:bg-gray-700 flex items-center justify-center"
                >
                  <IconEdit />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => toggleAttendance(s.id, "Present")}
                  className="px-3 py-1 rounded bg-[#FAC1D9] text-gray-900 cursor-pointer"
                >
                  Present
                </button>
                <button
                  onClick={() => toggleAttendance(s.id, "Absent")}
                  className="px-3 py-1 rounded bg-yellow-300 text-gray-900 cursor-pointer"
                >
                  Absent
                </button>
                <button
                  onClick={() => toggleAttendance(s.id, "Half Shift")}
                  className="px-3 py-1 rounded bg-sky-300 text-gray-900 whitespace-nowrap cursor-pointer"
                >
                  Half Shift
                </button>
                <button
                  onClick={() => toggleAttendance(s.id, "Leave")}
                  className="px-3 py-1 rounded bg-red-400 text-white cursor-pointer"
                >
                  Leave
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          className={`lg:hidden rounded-lg px-3 py-3 ${
            idx % 2 === 0 ? "bg-[#292C2D]" : "bg-[#3D4142]"
          }`}
        >
          <div className="flex items-center gap-3">
            <Avatar src={s.photo} name={s.name} size={10} />
            <div className="min-w-0">
              <div className="font-semibold text-gray-100 truncate">
                {s.name}
              </div>
              <div className="text-xs text-gray-400 truncate">{s.role}</div>
            </div>
          </div>

          <div className="text-sm text-gray-300 mt-2">
            <div className="text-xs text-gray-400">ID</div>
            <div>#{s.id}</div>
          </div>

          <div className="text-sm text-gray-300">
            <div className="text-xs text-gray-400">Date</div>
            <div>{att.date}</div>
          </div>

          <div className="text-sm text-gray-300">
            <div className="text-xs text-gray-400">Timings</div>
            <div className="truncate">{s.timings}</div>
          </div>

          <div className="text-sm text-gray-300">
            <div className="text-xs text-gray-400">Status</div>
            <div className={`${status ? "" : "text-gray-400"}`}>
              {status || "Not marked"}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 justify-center">
            {status ? (
              <>
                <div
                  className={`inline-block px-3 py-1 rounded ${pillClass(
                    status
                  )}`}
                >
                  {status}
                </div>
                <button
                  onClick={() => toggleAttendance(s.id, "")}
                  className="p-2 rounded bg-gray-800"
                >
                  <IconEdit />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => toggleAttendance(s.id, "Present")}
                  className="px-3 py-2 rounded bg-[#FAC1D9] text-gray-900"
                >
                  Present
                </button>
                <button
                  onClick={() => toggleAttendance(s.id, "Absent")}
                  className="px-3 py-2 rounded bg-yellow-300 text-gray-900"
                >
                  Absent
                </button>
                <button
                  onClick={() => toggleAttendance(s.id, "Half Shift")}
                  className="px-3 py-2 rounded bg-sky-300 text-gray-900 whitespace-nowrap"
                >
                  Half Shift
                </button>
                <button
                  onClick={() => toggleAttendance(s.id, "Leave")}
                  className="px-3 py-2 rounded bg-red-400 text-white"
                >
                  Leave
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  function handleOpenAdd() {
    setEditing({});
    setFormKey((k) => k + 1);
    setDrawerOpen(true);
  }

  function handleOpenEdit(staffItem) {
    setEditing(staffItem);
    setFormKey((k) => k + 1);
    setDrawerOpen(true);
  }

  return (
    <div className="min-h-screen bg-[#0f0f10] text-gray-100 p-8 font-[Poppins]">
      <div className="w-full mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-l px-4">Staff ({staff.length})</div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded bg-[#FAC1D9] text-gray-900"
            >
              Add Staff
            </button>

            <div className="flex items-center gap-2 bg-gray-800 rounded px-2 py-1">
              <label className="text-xs text-gray-300">Sort</label>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-sm text-[#5f5b5d] p-1 rounded outline-none"
              >
                <option value="id">ID</option>
                <option value="name">Name</option>
                <option value="role">Role</option>
                <option value="age">Age</option>
                <option value="salary">Salary</option>
                <option value="timings">Timings</option>
              </select>

              <button
                onClick={() =>
                  setSortOrder((o) => (o === "asc" ? "desc" : "asc"))
                }
                title="Toggle order"
                className="cursor-pointer px-2 py-1 rounded bg-[#2b3340] hover:bg-[#343c4d]"
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setTab("staff")}
            className={`px-4 py-2 rounded ${
              tab === "staff"
                ? "bg-[#FAC1D9] text-gray-900"
                : "bg-transparent text-gray-300"
            }`}
          >
            Staff Management
          </button>
          <button
            onClick={() => setTab("attendance")}
            className={`px-4 py-2 rounded ${
              tab === "attendance"
                ? "bg-[#FAC1D9] text-gray-900"
                : "bg-transparent text-gray-300"
            }`}
          >
            Attendance
          </button>
        </div>

        <div className="space-y-3 px-4">
          {tab === "staff" ? (
            <div className="hidden lg:block bg-transparent text-xs px-4 py-2">
              <div className={`grid ${STAFF_GRID} items-center px-4 py-3`}>
                <div className="flex items-center justify-start">
                  <input type="checkbox" className="bg-[#FAC1D9]" />
                </div>
                <div>ID</div>
                <div>Name</div>
                <div>Email</div>
                <div>Phone</div>
                <div>Age</div>
                <div>Salary</div>
                <div>Timings</div>
                <div className="text-right">Actions</div>
              </div>
            </div>
          ) : (
            <div className="hidden lg:block bg-transparent text-xs px-4 py-2">
              <div className={`grid ${ATTENDANCE_GRID} items-center px-4 py-3`}>
                <div className="flex items-center justify-start">
                  <input type="checkbox" className="bg-[#FAC1D9]" />
                </div>
                <div>ID</div>
                <div>Name</div>
                <div>Date</div>
                <div>Timings</div>
                <div>Status</div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {tab === "staff" &&
              sortedStaff.map((s, idx) => (
                <StaffRow key={s.id} s={s} index={idx} />
              ))}

            {tab === "attendance" &&
              sortedStaff.map((s, idx) => (
                <AttendanceRow key={s.id} s={s} idx={idx} />
              ))}
          </div>
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 flex justify-end z-40">
          <div
            className="absolute inset-0 bg-black/60 z-40"
            onClick={() => {
              setDrawerOpen(false);
              setEditing(null);
            }}
          />
          <div className="w-full sm:w-[420px] bg-[#1c1c1d] h-full shadow-xl overflow-auto border-l border-gray-800 z-50">
            <StaffForm
              key={formKey}
              initial={editing || {}}
              onCancel={() => {
                setDrawerOpen(false);
                setEditing(null);
              }}
              onConfirm={(payload) => {
                if (editing && editing.id) payload.id = editing.id;
                onSaveStaff(payload);
              }}
            />
          </div>
        </div>
      )}

      {detailView && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-10">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setDetailView(null)}
          />
          <div className="relative w-full max-w-4xl bg-[#111] text-gray-100 rounded p-6 sm:p-8 z-50 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="col-span-1">
              <div className="w-full h-56 sm:h-64 bg-[#292C2D] rounded overflow-hidden">
                {detailView.photo ? (
                  <img
                    src={detailView.photo}
                    alt={detailView.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-pink-200">
                    No Image
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-2">
                <button
                  onClick={() => {
                    handleOpenEdit(detailView);
                    setDetailView(null);
                  }}
                  className="w-full py-3 rounded bg-[#FAC1D9] text-gray-900 mb-2"
                >
                  Edit profile
                </button>
                <button
                  onClick={() => {
                    onDelete(detailView);
                    setDetailView(null);
                  }}
                  className="w-full py-3 rounded border border-gray-600 text-gray-200"
                >
                  Delete profile
                </button>
              </div>
            </div>

            <div className="col-span-2 space-y-4">
              <h2 className="text-xl font-semibold">{detailView.name}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#292C2D] p-4 rounded">
                  <div className="text-xs text-[#FAC1D9]">Full Name</div>
                  <div className="text-sm text-gray-100">{detailView.name}</div>

                  <div className="mt-3 text-xs text-[#FAC1D9]">
                    Phone number
                  </div>
                  <div className="text-sm text-gray-100">
                    {detailView.phone}
                  </div>

                  <div className="mt-3 text-xs text-[#FAC1D9]">Address</div>
                  <div className="text-sm text-gray-100">
                    {detailView.address ||
                      "House # 114 Street 123 USA, Chicago"}
                  </div>
                </div>

                <div className="bg-[#292C2D] p-4 rounded">
                  <div className="text-xs text-[#FAC1D9]">Email</div>
                  <div className="text-sm text-gray-100">
                    {detailView.email}
                  </div>

                  <div className="mt-3 text-xs text-[#FAC1D9]">
                    Date of birth
                  </div>
                  <div className="text-sm text-gray-100">
                    {detailView.dob || "01-Jan-1983"}
                  </div>
                </div>

                <div className="bg-[#292C2D] p-4 rounded col-span-2">
                  <div className="text-xs text-[#FAC1D9]">
                    Employee Job Details
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    <div>
                      <div className="text-xs text-[#FAC1D9]">Role</div>
                      <div className="text-sm text-gray-100">
                        {detailView.role}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-[#FAC1D9]">Salary</div>
                      <div className="text-sm text-gray-100">
                        {detailView.salary}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-[#FAC1D9]">
                        Shift start timing
                      </div>
                      <div className="text-sm text-gray-100">
                        {detailView.start || "9am"}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-[#FAC1D9]">
                        Shift end timing
                      </div>
                      <div className="text-sm text-gray-100">
                        {detailView.end || "6pm"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              className="absolute top-3 right-3 text-lg"
              onClick={() => setDetailView(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
