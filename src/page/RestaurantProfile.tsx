import { useState, useEffect, useRef } from "react";
import { ImageIcon, MapPin, Pencil, Save, X } from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";


// Define the shape of your data based on the original form
interface RestaurantData {
  restaurantName: string;
  contactInfo: string;
  phone: string;
  description: string;
  category: string;
  restaurantTable: string;
  address: string;
  openHour: string;
  openMinute: string;
  closeHour: string;
  closeMinute: string;
  priceMin: string;
  priceMax: string;
  coverImageUrl?: string;
}

/* ── Editable field component ── */
function EditableField({
  label,
  value,
  fieldKey,
  editingField,
  onStartEdit,
  onChangeField,
  onCancelEdit,
  type = "text",
  icon,
  inputClassName,
  displayClassName,
}: {
  label: string;
  value: string;
  fieldKey: string;
  editingField: string | null;
  onStartEdit: (key: string) => void;
  onChangeField: (key: string, val: string) => void;
  onCancelEdit: () => void;
  type?: string;
  icon?: React.ReactNode;
  inputClassName?: string;
  displayClassName?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isEditing = editingField === fieldKey;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const baseDisplay =
    displayClassName ??
    "w-full rounded-md border border-gray-300 bg-gray-50/50 px-5 py-3 text-sm text-gray-800 transition min-h-[46px] flex items-center";

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1">
        {label}
      </label>
      <div className="relative group">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type={type}
              value={value}
              onChange={(e) => onChangeField(fieldKey, e.target.value)}
              className={
                inputClassName ??
                "w-full rounded-md border-2 border-amber-400 bg-white px-5 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-amber-200 min-h-[46px]"
              }
            />
            <button
              type="button"
              onClick={onCancelEdit}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-400"
              title="Cancel"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div
            onClick={() => onStartEdit(fieldKey)}
            className={`${baseDisplay} cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 pr-10`}
          >
            <span className="flex-1 truncate">{value || "N/A"}</span>
            {icon && (
              <span className="absolute right-10 top-1/2 -translate-y-1/2">
                {icon}
              </span>
            )}
            <Pencil
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Editable textarea component ── */
function EditableTextarea({
  label,
  value,
  fieldKey,
  editingField,
  onStartEdit,
  onChangeField,
  onCancelEdit,
}: {
  label: string;
  value: string;
  fieldKey: string;
  editingField: string | null;
  onStartEdit: (key: string) => void;
  onChangeField: (key: string, val: string) => void;
  onCancelEdit: () => void;
}) {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const isEditing = editingField === fieldKey;

  useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1">
        {label}
      </label>
      <div className="relative group">
        {isEditing ? (
          <div className="flex items-start gap-2">
            <textarea
              ref={textRef}
              value={value}
              onChange={(e) => onChangeField(fieldKey, e.target.value)}
              rows={3}
              className="w-full rounded-2xl border-2 border-amber-400 bg-white px-5 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-amber-200 min-h-[80px] resize-none"
            />
            <button
              type="button"
              onClick={onCancelEdit}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-400 mt-1"
              title="Cancel"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div
            onClick={() => onStartEdit(fieldKey)}
            className="w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-5 py-3 text-sm text-gray-800 transition min-h-[80px] cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 pr-10 relative group"
          >
            <span>{value || "N/A"}</span>
            <Pencil
              size={16}
              className="absolute right-3 top-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Editable time box ── */
function EditableTimeBox({
  value,
  fieldKey,
  editingField,
  onStartEdit,
  onChangeField,
  className,
}: {
  value: string;
  fieldKey: string;
  editingField: string | null;
  onStartEdit: (key: string) => void;
  onChangeField: (key: string, val: string) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isEditing = editingField === fieldKey;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const boxClass =
    className ??
    "w-16 h-14 rounded-lg border-2 border-amber-400 bg-amber-50 flex items-center justify-center text-xl font-semibold text-gray-800";

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        maxLength={2}
        value={value}
        onChange={(e) => onChangeField(fieldKey, e.target.value.replace(/\D/g, "").slice(0, 2))}
        onBlur={() => onStartEdit("")}
        className={`${boxClass} text-center outline-none focus:ring-2 focus:ring-amber-200 bg-white`}
      />
    );
  }

  return (
    <div
      onClick={() => onStartEdit(fieldKey)}
      className={`${boxClass} cursor-pointer hover:bg-amber-100 transition-colors relative group`}
    >
      {value || "--"}
      <Pencil
        size={10}
        className="absolute -top-1 -right-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  );
}

const emptyProfile: RestaurantData = {
  restaurantName: "",
  contactInfo: "",
  phone: "",
  description: "",
  category: "",
  restaurantTable: "",
  address: "",
  openHour: "",
  openMinute: "",
  closeHour: "",
  closeMinute: "",
  priceMin: "",
  priceMax: "",
};

export default function RestaurantProfileInfo() {
  const [profile, setProfile] = useState<RestaurantData>(emptyProfile);
  const [editData, setEditData] = useState<RestaurantData>(emptyProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [uid, setUid] = useState<string | null>(null);

  // Listen for auth state and fetch restaurant data for the logged-in user
  useEffect(() => {
    // This listens for the user's login state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // ✅ The user IS logged in! 
        console.log("User is logged in with UID:", user.uid);
        setUid(user.uid);
        
        try {
          // Fetch the document that perfectly matches their UID
          const docRef = doc(db, "restaurants", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            // Data exists! Load it into the form
            const data = docSnap.data() as RestaurantData;
            setProfile({ ...emptyProfile, ...data });
            setEditData({ ...emptyProfile, ...data });
          } else {
            // They are logged in, but haven't saved any profile info yet.
            // The form will stay empty so they can fill it out!
            console.log("No profile found for this user yet.");
          }
        } catch (error) {
          console.error("Error fetching restaurant data:", error);
        }
      } else {
        // ❌ The user is NOT logged in!
        console.log("No user is currently logged in.");
        // Optional: Redirect them to the login page here
        // window.location.href = "/login"; 
      }
      setIsLoading(false);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  /* ── handlers ── */
  const handleStartEdit = (key: string) => {
    setEditingField(key);
  };

  const handleCancelEdit = () => {
    // Revert the single field back to the saved profile value
    if (editingField) {
      setEditData({
        ...editData,
        [editingField]: (profile as unknown as Record<string, string>)[editingField] ?? "",
      });
    }
    setEditingField(null);
  };

  const handleChangeField = (key: string, value: string) => {
    const updated = { ...editData, [key]: value };
    setEditData(updated);
    // Check if anything differs from the saved profile
    setHasChanges(JSON.stringify(updated) !== JSON.stringify(profile));
  };

  const handleSave = async () => {
    if (!uid) return;
    setIsSaving(true);
    try {
      const docRef = doc(db, "restaurants", uid);
      await setDoc(docRef, { ...editData }, { merge: true });

      setProfile({ ...editData });
      setHasChanges(false);
      setEditingField(null);
      
      // Optional: Add a success alert so you know it worked!
      alert("Profile saved successfully!"); 
    } catch (error) {
      console.error("Error saving restaurant data:", error);
      alert("Failed to save! Check the browser console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setEditData({ ...profile });
    setHasChanges(false);
    setEditingField(null);
  };

  /* ── styles ── */
  const timeBoxClass =
    "w-16 h-14 rounded-lg border-2 border-amber-400 bg-amber-50 flex items-center justify-center text-xl font-semibold text-gray-800";

  const formatCategory = (val?: string) => {
    if (!val) return "N/A";
    return val
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 md:p-10 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-500">Loading profile...</div>
      </div>
    );
  }

  const d = editData; // shorthand

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      {/* Header row with save / discard buttons */}
      <div className="flex items-center justify-between mb-8">
        <div className="text-3xl font-bold text-gray-900">Restaurant Profile</div>
        {hasChanges && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleDiscard}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              <X size={16} />
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50 transition"
            >
              <Save size={16} />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-2">
        {/* ═══════════════ LEFT COLUMN ═══════════════ */}
        <div className="space-y-5">
          <EditableField
            label="Restaurant Name"
            value={d?.restaurantName ?? ""}
            fieldKey="restaurantName"
            editingField={editingField}
            onStartEdit={handleStartEdit}
            onChangeField={handleChangeField}
            onCancelEdit={handleCancelEdit}
          />

          <EditableField
            label="Email"
            value={d?.contactInfo ?? ""}
            fieldKey="contactInfo"
            editingField={editingField}
            onStartEdit={handleStartEdit}
            onChangeField={handleChangeField}
            onCancelEdit={handleCancelEdit}
            type="email"  
          />

          <EditableField
            label="Phone Number"
            value={d?.phone ?? ""}
            fieldKey="phone"
            editingField={editingField}
            onStartEdit={handleStartEdit}
            onChangeField={handleChangeField}
            onCancelEdit={handleCancelEdit}
            type="tel"
          />

          <EditableTextarea
            label="Description"
            value={d?.description ?? ""}
            fieldKey="description"
            editingField={editingField}
            onStartEdit={handleStartEdit}
            onChangeField={handleChangeField}
            onCancelEdit={handleCancelEdit}
          />

          {/* Restaurant Category & Table */}
          <div className="grid grid-cols-2 gap-4">
            <EditableField
              label="Restaurant Category"
              value={
                editingField === "category"
                  ? d?.category ?? ""
                  : formatCategory(d?.category)
              }
              fieldKey="category"
              editingField={editingField}
              onStartEdit={handleStartEdit}
              onChangeField={handleChangeField}
              onCancelEdit={handleCancelEdit}
            />
            <EditableField
              label="Restaurant Table"
              value={d?.restaurantTable ?? ""}
              fieldKey="restaurantTable"
              editingField={editingField}
              onStartEdit={handleStartEdit}
              onChangeField={handleChangeField}
              onCancelEdit={handleCancelEdit}
            />
          </div>

          <EditableField
            label="Address"
            value={d?.address ?? ""}
            fieldKey="address"
            editingField={editingField}
            onStartEdit={handleStartEdit}
            onChangeField={handleChangeField}
            onCancelEdit={handleCancelEdit}
            icon={<MapPin size={20} className="text-green-500" />}
          />
        </div>

        {/* ═══════════════ RIGHT COLUMN ═══════════════ */}
        <div className="space-y-6">
          {/* Display Picture */}
          <div className="mx-auto w-full max-w-xs h-48 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col items-center justify-center overflow-hidden">
            {d?.coverImageUrl ? (
              <img
                src={d.coverImageUrl}
                alt="Restaurant"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <ImageIcon size={40} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">No Picture Provided</span>
              </>
            )}
          </div>

          {/* Open / Close time */}
          <div className="flex items-end gap-8">
            {/* Open */}
            <div className="text-center">
              <span className="block text-sm font-semibold text-gray-700 mb-2">
                open
              </span>
              <div className="flex items-center gap-1">
                <EditableTimeBox
                  value={d?.openHour ?? ""}
                  fieldKey="openHour"
                  editingField={editingField}
                  onStartEdit={handleStartEdit}
                  onChangeField={handleChangeField}
                />
                <span className="text-2xl font-bold text-gray-700">:</span>
                <EditableTimeBox
                  value={d?.openMinute ?? ""}
                  fieldKey="openMinute"
                  editingField={editingField}
                  onStartEdit={handleStartEdit}
                  onChangeField={handleChangeField}
                />
              </div>
              <div className="flex gap-1 mt-1 text-xs text-gray-500">
                <span className="w-16 text-center">Hour</span>
                <span className="w-4" />
                <span className="w-16 text-center">Minute</span>
              </div>
            </div>

            {/* Close */}
            <div className="text-center">
              <span className="block text-sm font-semibold text-gray-700 mb-2">
                close
              </span>
              <div className="flex items-center gap-1">
                <EditableTimeBox
                  value={d?.closeHour ?? ""}
                  fieldKey="closeHour"
                  editingField={editingField}
                  onStartEdit={handleStartEdit}
                  onChangeField={handleChangeField}
                />
                <span className="text-2xl font-bold text-gray-700">:</span>
                <EditableTimeBox
                  value={d?.closeMinute ?? ""}
                  fieldKey="closeMinute"
                  editingField={editingField}
                  onStartEdit={handleStartEdit}
                  onChangeField={handleChangeField}
                />
              </div>
              <div className="flex gap-1 mt-1 text-xs text-gray-500">
                <span className="w-16 text-center">Hour</span>
                <span className="w-4" />
                <span className="w-16 text-center">Minute</span>
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <span className="block text-sm font-semibold text-gray-700 mb-2">
              Price Range
            </span>
            <div className="flex items-center gap-2">
              <EditableTimeBox
                value={d?.priceMin ?? ""}
                fieldKey="priceMin"
                editingField={editingField}
                onStartEdit={handleStartEdit}
                onChangeField={handleChangeField}
              />
              <span className="text-2xl font-bold text-amber-500">$</span>
              <span className="text-xl text-gray-400 mx-1">-</span>
              <EditableTimeBox
                value={d?.priceMax ?? ""}
                fieldKey="priceMax"
                editingField={editingField}
                onStartEdit={handleStartEdit}
                onChangeField={handleChangeField}
                className={`${timeBoxClass} w-20`}
              />
              <span className="text-2xl font-bold text-amber-500">$</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}