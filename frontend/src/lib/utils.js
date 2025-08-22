export const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export function formatNotificationTime(createdAt) {
  const createdDate = new Date(createdAt);
  const now = new Date();

  const diffMs = now - createdDate;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 24) {
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return diffMinutes <= 1 ? "Just now" : `${diffMinutes} min ago`;
    }
    return `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
  }

  return createdDate.toLocaleString();
}
