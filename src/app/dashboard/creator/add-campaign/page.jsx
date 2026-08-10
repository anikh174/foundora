"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Rocket, Camera, ImagePlus } from "lucide-react";
import toast from "react-hot-toast";
import { api, extractError } from "@/lib/api";
import { uploadImage } from "@/lib/imgbb";
import { Spinner } from "@/components/ui/Spinner";

const categories = [
  "Education",
  "Health & Medicine",
  "Technology & Innovation",
  "Environment",
  "Community & Social",
  "Arts & Culture",
  "Emergency Relief",
  "Food & Hunger",
];

const initialForm = {
  title: "",
  story: "",
  category: "",
  fundingGoal: "",
  minimumContribution: "",
  deadline: "",
  reward: "",
};

export default function AddCampaign() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Campaign title is required";
    else if (form.title.trim().length < 10) next.title = "Title must be at least 10 characters";
    if (!form.story.trim()) next.story = "Story is required";
    else if (form.story.trim().length < 50) next.story = "Story must be at least 50 characters";
    if (!form.category) next.category = "Select a category";
    if (!form.fundingGoal || Number(form.fundingGoal) < 100) next.fundingGoal = "Funding goal must be at least 100 credits";
    if (!form.minimumContribution || Number(form.minimumContribution) < 5) next.minimumContribution = "Minimum contribution must be at least 5 credits";
    if (!form.deadline) next.deadline = "Deadline is required";
    else if (new Date(form.deadline) <= new Date()) next.deadline = "Deadline must be in the future";
    if (!imageUrl) next.image = "Upload a campaign image";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
      toast.success("Campaign image uploaded");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/api/campaigns", {
        title: form.title.trim(),
        story: form.story.trim(),
        category: form.category,
        fundingGoal: Number(form.fundingGoal),
        minimumContribution: Number(form.minimumContribution),
        deadline: form.deadline,
        reward: form.reward.trim(),
        image: imageUrl,
      });
      toast.success("Campaign submitted for admin approval!");
      router.push("/dashboard/creator/my-campaigns");
    } catch (error) {
      toast.error(extractError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase =
    "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition bg-white";

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/25">
          <Rocket className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Add New Campaign</h1>
          <p className="text-sm text-slate-500">Tell your story and set your funding goal</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 md:p-8 space-y-6">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Campaign image</label>
          <div className="mt-2">
            {imageUrl ? (
              <div className="relative rounded-2xl overflow-hidden h-52">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Campaign" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-white/95 text-xs font-bold text-slate-700 hover:bg-white"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-52 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-emerald-400 hover:bg-emerald-50/40 cursor-pointer transition">
                {uploadingImage ? (
                  <Spinner className="w-6 h-6" />
                ) : (
                  <>
                    <ImagePlus className="w-8 h-8 text-slate-300" />
                    <p className="mt-2 text-sm font-semibold text-slate-600">Click to upload an image</p>
                    <p className="text-xs text-slate-400">PNG, JPG or WEBP up to 4MB</p>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>
          {errors.image && <p className="mt-1.5 text-xs text-rose-600">{errors.image}</p>}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Campaign title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Solar-Powered Learning Hub for Rural Students"
            className={`${inputBase} mt-1.5`}
          />
          {errors.title && <p className="mt-1.5 text-xs text-rose-600">{errors.title}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={`${inputBase} mt-1.5`}
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1.5 text-xs text-rose-600">{errors.category}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Deadline</label>
            <input
              type="date"
              value={form.deadline}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className={`${inputBase} mt-1.5`}
            />
            {errors.deadline && <p className="mt-1.5 text-xs text-rose-600">{errors.deadline}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Funding goal (credits)</label>
            <input
              type="number"
              value={form.fundingGoal}
              onChange={(e) => setForm({ ...form, fundingGoal: e.target.value })}
              placeholder="e.g. 25000"
              className={`${inputBase} mt-1.5`}
            />
            {errors.fundingGoal && <p className="mt-1.5 text-xs text-rose-600">{errors.fundingGoal}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Minimum contribution (credits)</label>
            <input
              type="number"
              value={form.minimumContribution}
              onChange={(e) => setForm({ ...form, minimumContribution: e.target.value })}
              placeholder="e.g. 50"
              className={`${inputBase} mt-1.5`}
            />
            {errors.minimumContribution && <p className="mt-1.5 text-xs text-rose-600">{errors.minimumContribution}</p>}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Campaign story</label>
          <textarea
            value={form.story}
            onChange={(e) => setForm({ ...form, story: e.target.value })}
            rows={7}
            placeholder="Describe your campaign, why it matters, how funds will be used, and who it will help..."
            className={`${inputBase} mt-1.5 resize-none`}
          />
          {errors.story && <p className="mt-1.5 text-xs text-rose-600">{errors.story}</p>}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Rewards for backers</label>
          <textarea
            value={form.reward}
            onChange={(e) => setForm({ ...form, reward: e.target.value })}
            rows={4}
            placeholder="e.g. Backers of 100+ credits receive a thank-you card and a digital certificate..."
            className={`${inputBase} mt-1.5 resize-none`}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20 disabled:opacity-60"
          >
            {submitting ? <Spinner className="w-4 h-4" color="text-current" /> : <Rocket className="w-4 h-4" />}
            Submit for review
          </button>
        </div>
      </form>
    </div>
  );
}
