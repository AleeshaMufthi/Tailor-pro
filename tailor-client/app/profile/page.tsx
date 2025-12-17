'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const router = useRouter()
  const { user, setUser } = useAuth()

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    fullName: '',
    shopName: '',
    tailorType: 'both',
    phone: '',
    userPhoto: '',
    shopPhoto: ''
  })

  const [userPhotoFile, setUserPhotoFile] = useState<File | null>(null)
  const [shopPhotoFile, setShopPhotoFile] = useState<File | null>(null)

  const [userPhotoPreview, setUserPhotoPreview] = useState<string | null>(null)
  const [shopPhotoPreview, setShopPhotoPreview] = useState<string | null>(null)

  const fileInputUserRef = useRef<HTMLInputElement | null>(null)
  const fileInputShopRef = useRef<HTMLInputElement | null>(null)

  // ✅ Fetch existing profile from backend
  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await api.get('/api/user/get-profile')

      const data = res.data.user

      console.log(data, 'data')

      setForm({
        fullName: data.fullName || '',
        shopName: data.shopName || '',
        tailorType: data.tailorType || 'both',
        phone: data.phone || '',
        userPhoto: data.userPhoto || '',
        shopPhoto: data.shopPhoto || ''
      })
    } catch (err) {
      console.log('No existing profile found')
    }
  }

  // ✅ Sync form when global user updates
  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        shopName: user.shopName || '',
        tailorType: user.tailorType || 'both',
        phone: user.phone || '',
        userPhoto: user.userPhoto || '',
        shopPhoto: user.shopPhoto || ''
      })
    }
  }, [user])

  function handleChange(e: any) {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  function handleUserPhotoChange(e: any) {
    const file = e.target.files?.[0]
    setUserPhotoFile(file)
    setUserPhotoPreview(file ? URL.createObjectURL(file) : null)
  }

  function handleShopPhotoChange(e: any) {
    const file = e.target.files?.[0]
    setShopPhotoFile(file)
    setShopPhotoPreview(file ? URL.createObjectURL(file) : null)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      let userPhotoUrl = form.userPhoto
      let shopPhotoUrl = form.shopPhoto

      if (userPhotoFile) {
        userPhotoUrl = await uploadToCloudinary(userPhotoFile)
      }

      if (shopPhotoFile) {
        shopPhotoUrl = await uploadToCloudinary(shopPhotoFile)
      }



      const payload = {
        fullName: form.fullName,
        phone: form.phone,
        shopName: form.shopName,
        tailorType: form.tailorType,
        userPhoto: userPhotoUrl,
        shopPhoto: shopPhotoUrl
      }

      console.log("Form state: payloads", payload);

      const res = await api.put('/api/user/profile', payload)

      if (res?.data?.user) {
        const updatedUser = res.data.user

        // ✅ update global auth state
        setUser(updatedUser)

        // ✅ update local form state
        setForm({
          fullName: updatedUser.fullName || '',
          shopName: updatedUser.shopName || '',
          tailorType: updatedUser.tailorType || 'both',
          phone: updatedUser.phone || '',
          userPhoto: updatedUser.userPhoto || '',
          shopPhoto: updatedUser.shopPhoto || ''
        })

        // ✅ clear preview
        setUserPhotoPreview(null)
        setShopPhotoPreview(null)
        setUserPhotoFile(null)
        setShopPhotoFile(null)
      }

      setIsEditing(false)
    } catch (err) {
      alert('Profile update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-20 bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-semibold mb-6">Boutique Owner Profile</h1>

      {/* ========== VIEW MODE ========== */}
      {!isEditing && (
        <>
          <div className="space-y-4">
            <p><b>Full Name:</b> {form.fullName}</p>
            <p><b>Phone:</b> {form.phone}</p>
            <p><b>Shop Name:</b> {form.shopName}</p>
            <p><b>Tailor Type:</b> {form.tailorType}</p>

            <div className="flex gap-6 mt-4">
              <img
                src={form.userPhoto || '/default.png'}
                className="h-28 w-28 object-cover rounded"
              />
              <img
                src={form.shopPhoto || '/default.png'}
                className="h-28 w-28 object-cover rounded"
              />
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="mt-6 w-full bg-blue-500 text-white py-3 rounded"
          >
            Edit Profile
          </button>
        </>
      )}

      {/* ========== EDIT MODE ========== */}
      {isEditing && (
        <>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="w-full mb-4 p-3 border rounded"
            placeholder="Full name"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full mb-4 p-3 border rounded"
            placeholder="Phone number"
          />

          <input
            name="shopName"
            value={form.shopName}
            onChange={handleChange}
            className="w-full mb-4 p-3 border rounded"
            placeholder="Boutique / Shop name"
          />

          <select
            name="tailorType"
            value={form.tailorType}
            onChange={handleChange}
            className="w-full mb-4 p-3 border rounded"
          >
            <option value="gents">Gents</option>
            <option value="ladies">Ladies</option>
            <option value="both">Both</option>
          </select>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label>User Photo</label>
              <img
                src={userPhotoPreview || form.userPhoto || '/default.png'}
                className="h-28 w-28 object-cover rounded mb-2"
              />
              <input type="file" accept="image/*" onChange={handleUserPhotoChange} />
            </div>

            <div>
              <label>Shop Photo</label>
              <img
                src={shopPhotoPreview || form.shopPhoto || '/default.png'}
                className="h-28 w-28 object-cover rounded mb-2"
              />
              <input type="file" accept="image/*" onChange={handleShopPhotoChange} />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-emerald-500 text-white py-3 rounded"
          >
            {loading ? 'Saving…' : 'Save Changes'}
          </button>

          <button
            onClick={() => setIsEditing(false)}
            className="w-full mt-2 border py-2 rounded"
          >
            Cancel
          </button>
        </>
      )}
    </div>
  )
}
