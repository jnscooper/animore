import type { AnimeType } from '@/types/jikan-api'

export const iconMapping: Record<AnimeType, string> = {
  TV: 'icon-[tabler--device-tv-filled]',
  OVA: 'icon-[tabler--disc]',
  Movie: 'icon-[tabler--movie]',
  Special: 'icon-[tabler--star]',
  ONA: 'icon-[tabler--world]',
  Music: 'icon-[tabler--music]',
  CM: 'icon-[tabler--megaphone]',
  PV: 'icon-[tabler--presentation]',
  'TV Special': 'icon-[tabler--device-tv-old]',
  Unknown: '',
}
