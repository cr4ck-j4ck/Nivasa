"use client"

import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, Pen, User } from "lucide-react"
import InputField from "../Auth/InputField"
import { AvatarUpload } from "./AvatarUpload"
import CustomAlert from "../CustomAlert"
import useUserStore from "@/Store/UserStore"
import useGlobalStore from "@/Store/Global"
import { Button } from "../ui/button"
import { updateUserProfile, type ProfileUpdateData } from "@/Services/user.api"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"
import SavingLoading from "./SavingLoading"

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  bio: z.string().max(300, "Bio must be 300 characters or less").optional().or(z.literal("")),
  // avatar handled separately
})

type FormValues = z.infer<typeof schema>

export default function PersonalDetailsEditForm() {
  const navigate = useNavigate()
  const { user, updateUser } = useUserStore()
  const { loading, alert, setAlert, clearAlert } = useGlobalStore()
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarError, setAvatarError] = useState<string | undefined>()
  const [saving, setSaving] = useState<boolean>(false)
  const [operationComplete, setOperationComplete] = useState<boolean>(false)
  const [submittedValues, setSubmittedValues] = useState<FormValues | null>(null)

  // Initialize avatar preview when user data is available
  useEffect(() => {
    if (user?.avatar) {
      setAvatarPreview(user.avatar)
    }
  }, [user?.avatar])

  const defaultValues = useMemo<FormValues>(
    () => ({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      bio: user?.bio || "",
    }),
    [user],
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  })

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) URL.revokeObjectURL(avatarPreview)
    }
  }, [avatarPreview])

  function onAvatarChange(file: File | null) {
    setAvatarError(undefined)
    setAvatarFile(file)
    if (avatarPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview)
    }
    if (!file) {
      setAvatarPreview(null)
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError("File size must be less than 2MB")
      setAvatarFile(null)
      setAvatarPreview(null)
      return
    }
    const url = URL.createObjectURL(file)
    setAvatarPreview(url)
  }

  // Handle the actual API operation
  useEffect(() => {
    if (!saving || !submittedValues) return

    const performUpdate = async () => {
      try {
        // Prepare data for API call
        const profileData: ProfileUpdateData = {
          firstName: submittedValues.firstName,
          lastName: submittedValues.lastName,
          email: submittedValues.email,
          bio: submittedValues.bio || "",
          avatar: avatarFile,
        }

        // Call API to update profile
        const updatedUser = await updateUserProfile(profileData)
        
        // Update local store with response from server
        updateUser(updatedUser)
        
        // Mark operation as complete
        setOperationComplete(true)
        setAlert({ type: "success", message: "Your profile has been updated successfully." })
        
      } catch (error) {
        console.error('Profile update error:', error)
        setSaving(false)
        setOperationComplete(false)
        setAlert({ 
          type: "error", 
          message: error instanceof Error ? error.message : "Failed to update profile. Please try again." 
        })
      }
    }

    performUpdate()
  }, [saving, submittedValues, avatarFile, updateUser, setAlert])

  // Handle completion of loading screen
  const handleLoadingComplete = () => {
    setSaving(false)
    setOperationComplete(false)
    setTimeout(() => {
      navigate("/dashboard")
    }, 300)
  }

  const onSubmit = handleSubmit(async (values) => {
    clearAlert()
    
    // Validate avatar if present
    if (avatarError) {
      setAlert({ type: "error", message: avatarError })
      return
    }
    
    // Additional client-side validation
    if (avatarFile && avatarFile.size > 2 * 1024 * 1024) {
      setAlert({ type: "error", message: "Avatar file size must be less than 2MB" })
      return
    }
    
    setSubmittedValues(values)
    setOperationComplete(false)
    setSaving(true)
  })

  function onCancel() {
    clearAlert()
    setAvatarError(undefined)
    setAvatarFile(null)
    setAvatarPreview(user?.avatar ?? null)
    reset(defaultValues)
  }

  if (saving) {
    return <SavingLoading onComplete={handleLoadingComplete} isComplete={operationComplete} />
  }

  // Show loading if user data is not available yet
  if (!user) {
    return (
      <div className="mx-auto w-full max-w-xl rounded-3xl bg-white/80 p-6 shadow-2xl ring-1 ring-black/5 backdrop-blur-lg transition will-change-transform md:p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
          <span className="ml-3 text-gray-600">Loading profile...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-xl rounded-3xl bg-white/80 p-6 shadow-2xl ring-1 ring-black/5 backdrop-blur-lg transition will-change-transform md:p-8 hover:scale-[1.02]">
      <div className="mb-6 space-y-2 text-center">
        <h1 className="text-balance text-2xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
          Edit Your Profile
        </h1>
        <p className="text-sm text-gray-600">Update your personal details and avatar.</p>
      </div>

      {alert ? <CustomAlert variant={alert.type} message={alert.message} /> : null}

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <InputField
            label="First Name"
            id="firstName"
            placeholder="Jane"
            icon={User}
            register={register}
            name="firstName"
            error={errors.firstName?.message}
          />
          <InputField
            label="Last Name"
            id="lastName"
            placeholder="Doe"
            icon={User}
            register={register}
            name="lastName"
            error={errors.lastName?.message}
          />
        </div>

        <InputField
          label="Email"
          id="email"
          placeholder="you@example.com"
          type="email"
          icon={Mail}
          register={register}
          name="email"
          error={errors.email?.message}
        />

        <AvatarUpload value={avatarPreview} onChange={onAvatarChange} error={avatarError} />

        <InputField
          label="Bio"
          id="bio"
          placeholder="A short description about you..."
          icon={Pen}
          register={register}
          name="bio"
          error={errors.bio?.message}
          textarea
        />

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button
            type="button"
            onClick={onCancel}
            className={cn("bg-white text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50")}
            disabled={loading || saving}
            variant="ghost"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className={cn("bg-white text-rose-600 shadow-sm ring-1 ring-gray-200 hover:bg-rose-50")}
            disabled={loading || saving || (!isDirty && !avatarFile)}
          >
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </form>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
