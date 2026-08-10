export const formatCredits = (value) => {
  const number = Number(value) || 0;
  if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`;
  if (number >= 1000) return `${(number / 1000).toFixed(1)}k`;
  return number.toLocaleString();
};

export const formatMoney = (value) => {
  const number = Number(value) || 0;
  return `$${number.toFixed(2)}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const daysRemaining = (deadline) => {
  if (!deadline) return 0;
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
};

export const progressPercent = (raised, goal) => {
  if (!goal) return 0;
  return Math.min(Math.round((Number(raised) / Number(goal)) * 100), 100);
};

export const categoryEmoji = {
  Education: "🎓",
  "Health & Medicine": "🩺",
  "Technology & Innovation": "💡",
  Environment: "🌱",
  "Community & Social": "🤝",
  "Arts & Culture": "🎨",
  "Emergency Relief": "🚨",
  "Food & Hunger": "🍲",
};

export const statusStyles = {
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  rejected: "bg-rose-50 text-rose-700 ring-rose-200",
  suspended: "bg-slate-100 text-slate-600 ring-slate-200",
};

export const roleStyles = {
  admin: "bg-slate-900 text-white ring-slate-900",
  creator: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  supporter: "bg-sky-50 text-sky-700 ring-sky-200",
};

export const timeAgo = (dateString) => {
  if (!dateString) return "";
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  return formatDate(dateString);
};
