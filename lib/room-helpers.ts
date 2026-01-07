// Helper functions para trabalhar com amenities e images como JSON strings (SQLite)

export function parseRoomData(room: any) {
  return {
    ...room,
    amenities: typeof room.amenities === 'string' 
      ? JSON.parse(room.amenities || '[]') 
      : room.amenities || [],
    images: typeof room.images === 'string' 
      ? JSON.parse(room.images || '[]') 
      : room.images || [],
  }
}

export function prepareRoomData(data: any) {
  return {
    ...data,
    amenities: Array.isArray(data.amenities) 
      ? JSON.stringify(data.amenities) 
      : data.amenities || '[]',
    images: Array.isArray(data.images) 
      ? JSON.stringify(data.images) 
      : data.images || '[]',
  }
}





