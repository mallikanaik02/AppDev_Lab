export const getTypeColor = (type) => {
  const colors = {
    fire: '#FF6B6B', water: '#4ECDC4', grass: '#95E1D3',
    electric: '#F9E71E', psychic: '#F8B500', ice: '#A8E6CF',
    dragon: '#A8A8FF', dark: '#8B5A3C', fairy: '#FFB6D9',
    normal: '#B8B8B8', fighting: '#FF5722', poison: '#9C27B0',
    ground: '#FFAB40', flying: '#81C784', bug: '#8BC34A',
    rock: '#8D6E63', ghost: '#9575CD', steel: '#90A4AE'
  };
  return colors[type] || '#78909C';
};

export const theme = {
  primary: '#3498db',
  secondary: '#2c3e50',
  background: '#f8f9fa',
  white: '#ffffff',
  error: '#e74c3c',
  text: '#2c3e50',
  textLight: '#666',
  success: '#27ae60'
};
