import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit3, Check, X, User, Phone, Calendar, Camera } from "lucide-react";
import Lottie from "lottie-react";
import rainbowCat from '../assets/Space Cat.json'
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import CatLove from '../assets/Lovely cats.json'

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        age: "",
        phone: "",
        interests: [] as string[],
    });

    const [profileImage, setProfileImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [errors, setErrors] = useState<{ name?: boolean, age?: boolean, phone?: boolean }>({});

    const INTEREST_OPTIONS = [
        "Coding", "Gaming", "Music", "Movies", "Travel", "Sports", "Reading",
    ];


    // fetching user data from firebase...

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const userRef = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUserData({
                        name: data.name || "",
                        email: data.email || "",
                        age: data.age || "",
                        phone: data.phone || "",
                        interests: data.interests || [],
                    });
                    if (data.profileImage) setProfileImage(data.profileImage);
                }
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);


    // to handle the array of interests...

    const toggleInterest = (interest: string) => {
        setUserData((prev) => {
            const selected = prev.interests.includes(interest);
            return {
                ...prev,
                interests: selected
                    ? prev.interests.filter((i) => i !== interest)
                    : [...prev.interests, interest],
            };
        });
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const imageURL = URL.createObjectURL(file);
        setProfileImage(imageURL);
    };

    // handling the user data update....

    const handleUpdateProfile = async () => {
        if (!auth.currentUser) return;

        const isValid =
            validateField("name", userData.name) &&
            validateField("age", userData.age) &&
            validateField("phone", userData.phone);

        if (!isValid) return;

        const userRef = doc(db, 'users', auth.currentUser.uid);


        try {
            let imageUrl = profileImage;
            const fileInput = fileInputRef.current?.files?.[0];
            if (fileInput) {
                console.log("Uploading new profile image...");
                const uploadedUrl = await uploadToCloudinary(fileInput);
                if (uploadedUrl) imageUrl = uploadedUrl;
            }

            await setDoc(
                userRef,
                {
                    name: userData.name,
                    age: userData.age,
                    phone: userData.phone,
                    interests: userData.interests,
                    profileImage: imageUrl || null,
                    updatedAt: new Date(),
                },
                { merge: true }
            );
            setIsEditing(false);
            console.log("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    }

    // error validation function...

    const validateField = (field: string, value: string) => {
        let valid = true;
        if (field === "name") valid = value.trim().length > 0;
        if (field === "age") valid = /^\d+$/.test(value) && Number(value) > 0;
        if (field === "phone") valid = /^\+?\d{10,15}$/.test(value);
        setErrors((prev) => ({ ...prev, [field]: !valid }));
        return valid;
    };

    //upload profile on cloudinary..
    const uploadToCloudinary = async (file: File) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "chatBuzz");
        data.append("folder", "chatBuzz");

        try {
            const res = await fetch("https://api.cloudinary.com/v1_1/dit3hmnff/image/upload", {
                method: "POST",
                body: data,
            });
            const json = await res.json();
            return json.secure_url;
        } catch (err) {
            console.error("Cloudinary upload failed:", err);
            return null;
        }
    };



    if (loading) {
        return (
            <motion.div
                className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white"
            >
                <div className="flex flex-col items-center">
                    <Lottie
                        animationData={CatLove}
                        loop={true}
                        className="w-48 h-48" // smaller size (192px)
                    />
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.div
                layout
                transition={{ layout: { duration: 0.3, type: "spring" } }}
                className="w-full max-w-md bg-gray-800/60 rounded-2xl shadow-xl border border-gray-700 p-6 space-y-4"
            >
                {/* Header */}
                <div className="flex items-center gap-4 relative">
                    <div className="relative">
                        <motion.div
                            layoutId="avatar"
                            className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold overflow-hidden"
                        >
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                userData.name.charAt(0)
                            )}
                        </motion.div>

                        {/* Camera icon when editing */}
                        {isEditing && (
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 bg-gray-900/80 p-1.5 rounded-full border border-gray-600 hover:bg-gray-800 transition-all"
                            >
                                <Camera size={14} />
                            </motion.button>
                        )}

                        {/* Hidden file input */}
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageSelect}
                            className="hidden"
                        />
                    </div>

                    <div className="flex-1">
                        {isEditing ? (
                            <motion.input
                                layout
                                type="text"
                                value={userData.name}
                                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                className={`bg-gray-700/50 rounded-lg px-3 py-2 text-sm w-full outline-none ring-1 ${errors.name ? "ring-red-500" : "ring-blue-500"
                                    }`}
                                placeholder="Full Name"
                            />
                        ) : (
                            <div className="flex items-center justify-between ">
                                <div>
                                    <h2 className="text-xl font-bold">{userData.name}</h2>
                                    <p className="text-sm text-gray-400">{userData.email}</p>
                                </div>
                                <div className="w-16 h-16">
                                    <Lottie animationData={rainbowCat} loop={true} className="h-22" />
                                </div>
                            </div>

                        )}
                    </div>
                </div>

                {/* Info Fields */}
                <motion.div layout className="space-y-3 mt-4">
                    <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <input
                            disabled={!isEditing}
                            value={userData.age}
                            onChange={(e) => setUserData({ ...userData, age: e.target.value })}
                            className={`flex-1 bg-gray-700/50 rounded-lg px-3 py-2 text-sm outline-none ring-1 ${errors.age ? "ring-red-500" : isEditing ? "ring-blue-500" : "opacity-70"
                                }`}
                            placeholder="Age"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone size={16} />
                        <input
                            disabled={!isEditing}
                            value={userData.phone}
                            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                            className={`flex-1 bg-gray-700/50 rounded-lg px-3 py-2 text-sm outline-none ring-1 ${errors.phone ? "ring-red-500" : isEditing ? "ring-blue-500" : "opacity-70"
                                }`}
                            placeholder="Phone"
                        />
                    </div>
                </motion.div>

                {/* Interests */}
                <motion.div layout>
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                        <User size={14} /> Interests
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {INTEREST_OPTIONS.map((interest) => {
                            const selected = userData.interests.includes(interest);
                            return (
                                <motion.button
                                    layout
                                    key={interest}
                                    whileTap={{ scale: 0.9 }}
                                    disabled={!isEditing}
                                    onClick={() => toggleInterest(interest)}
                                    className={`px-3 py-1 rounded-full text-xs border transition-all ${selected
                                        ? "bg-blue-600 border-blue-500"
                                        : "bg-gray-700/40 border-gray-600"
                                        } ${!isEditing ? "opacity-60 cursor-default" : "hover:bg-gray-600/60"}`}
                                >
                                    {interest}
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Buttons */}
                <AnimatePresence mode="wait">
                    {isEditing ? (
                        <motion.div
                            key="editing"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex justify-end gap-3 mt-6"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsEditing(false)}
                                className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm"
                            >
                                <X size={16} /> Cancel
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleUpdateProfile}
                                className="flex items-center gap-1 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg text-sm"
                            >
                                <Check size={16} /> Update Profile
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="viewing"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex justify-end mt-6"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm"
                            >
                                <Edit3 size={16} /> Edit Profile
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export default Profile;
