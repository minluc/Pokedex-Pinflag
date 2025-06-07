export function getFavorites() {
  return JSON.parse(sessionStorage.getItem('favorites')) || [];
}

export function saveFavorites(favorites) {
  sessionStorage.setItem('favorites', JSON.stringify(favorites));
}

export function toggleFavorite(name) {
  const current = getFavorites();
  const updated = current.includes(name)
    ? current.filter((f) => f !== name)
    : [...current, name];
  saveFavorites(updated);
  return updated;
}
