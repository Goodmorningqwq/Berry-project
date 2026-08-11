/**
 * Everything Berry can wear or hold.
 *
 * `slot`   — outfit | hat | accessory (one equipped per slot)
 * `art`    — key looked up by the renderer in components/BerryArt.jsx
 * `source` — blindbox | destination | milestone | starter
 */

export const RARITY_LABEL = {
  common: 'Common',
  rare: 'Rare',
  epic: 'Epic'
}

export const COSMETICS = [
  /* ---- starter ---- */
  { id: 'tee-basic', name: 'Berry Tee', slot: 'outfit', art: 'tee', rarity: 'common', source: 'starter' },

  /* ---- blindbox pool ---- */
  { id: 'uo-crew', name: 'UO Cabin Crew', slot: 'outfit', art: 'crew', rarity: 'epic', source: 'blindbox' },
  { id: 'uo-pilot', name: 'UO Pilot Uniform', slot: 'outfit', art: 'pilot', rarity: 'epic', source: 'blindbox' },
  { id: 'hoodie-purple', name: 'Purple Hoodie', slot: 'outfit', art: 'hoodie', rarity: 'common', source: 'blindbox' },
  { id: 'aloha-shirt', name: 'Aloha Shirt', slot: 'outfit', art: 'aloha', rarity: 'rare', source: 'blindbox' },
  { id: 'raincoat', name: 'Typhoon Raincoat', slot: 'outfit', art: 'raincoat', rarity: 'common', source: 'blindbox' },

  { id: 'captain-cap', name: 'Captain Cap', slot: 'hat', art: 'captainCap', rarity: 'rare', source: 'blindbox' },
  { id: 'beanie', name: 'Cosy Beanie', slot: 'hat', art: 'beanie', rarity: 'common', source: 'blindbox' },
  { id: 'party-hat', name: 'Party Hat', slot: 'hat', art: 'partyHat', rarity: 'common', source: 'blindbox' },
  { id: 'headphones', name: 'Flight Headphones', slot: 'hat', art: 'headphones', rarity: 'rare', source: 'blindbox' },

  { id: 'sunnies', name: 'Runway Sunnies', slot: 'accessory', art: 'sunnies', rarity: 'common', source: 'blindbox' },
  { id: 'neck-pillow', name: 'Neck Pillow', slot: 'accessory', art: 'neckPillow', rarity: 'common', source: 'blindbox' },
  { id: 'camera', name: 'Travel Camera', slot: 'accessory', art: 'camera', rarity: 'rare', source: 'blindbox' },
  { id: 'scarf', name: 'Winter Scarf', slot: 'accessory', art: 'scarf', rarity: 'common', source: 'blindbox' },

  /* ---- destination exclusives (earned post-flight) ---- */
  { id: 'kimono', name: 'Tokyo Kimono', slot: 'outfit', art: 'kimono', rarity: 'epic', source: 'destination' },
  { id: 'takoyaki-hat', name: 'Osaka Takoyaki Hat', slot: 'hat', art: 'takoyaki', rarity: 'rare', source: 'destination' },
  { id: 'hanbok', name: 'Seoul Hanbok', slot: 'outfit', art: 'hanbok', rarity: 'epic', source: 'destination' },
  { id: 'bubble-tea', name: 'Taipei Bubble Tea', slot: 'accessory', art: 'bubbleTea', rarity: 'rare', source: 'destination' },
  { id: 'thai-garland', name: 'Bangkok Garland', slot: 'accessory', art: 'garland', rarity: 'rare', source: 'destination' },
  { id: 'conical-hat', name: 'Da Nang Nón Lá', slot: 'hat', art: 'conical', rarity: 'rare', source: 'destination' },
  { id: 'ramen-bowl', name: 'Fukuoka Ramen Hat', slot: 'hat', art: 'ramen', rarity: 'rare', source: 'destination' },
  { id: 'snorkel', name: 'Phuket Snorkel', slot: 'accessory', art: 'snorkel', rarity: 'rare', source: 'destination' },
  { id: 'jeju-hat', name: 'Jeju Straw Hat', slot: 'hat', art: 'strawHat', rarity: 'rare', source: 'destination' },
  { id: 'lantern', name: 'Chiang Mai Lantern', slot: 'accessory', art: 'lantern', rarity: 'rare', source: 'destination' },
  { id: 'diving-fins', name: 'Ishigaki Fins', slot: 'accessory', art: 'fins', rarity: 'rare', source: 'destination' },
  { id: 'kota-shirt', name: 'Kota Kinabalu Batik', slot: 'outfit', art: 'batik', rarity: 'rare', source: 'destination' },

  /* ---- 30-day milestone exclusive ---- */
  {
    id: 'golden-wings',
    name: 'Golden Wings Set',
    slot: 'outfit',
    art: 'goldenWings',
    rarity: 'epic',
    source: 'milestone',
    note: '30-day check-in exclusive'
  }
]

export const MILESTONE_ITEM_ID = 'golden-wings'

/** Basic consumables handed out by daily check-in (from the brief). */
export const BASIC_ITEMS = [
  { id: 'berry-snack', name: 'Berry Snack', emoji: '🍪', note: 'Berry’s favourite' },
  { id: 'berry-soap', name: 'Berry Soap', emoji: '🧼', note: 'Keeps Berry fluffy' },
  { id: 'berry-juice', name: 'Berry Juice', emoji: '🧃', note: 'A little energy boost' }
]

export const BLINDBOX_POOL = COSMETICS.filter((i) => i.source === 'blindbox')

export const ITEMS_BY_ID = Object.fromEntries(COSMETICS.map((i) => [i.id, i]))
export const BASIC_ITEMS_BY_ID = Object.fromEntries(BASIC_ITEMS.map((i) => [i.id, i]))

export const SLOTS = [
  { id: 'outfit', label: 'Outfit' },
  { id: 'hat', label: 'Head' },
  { id: 'accessory', label: 'Accessory' }
]
