/**
 * Everything Berry can wear.
 *
 * `slot`   — look | hat | accessory (one equipped per slot)
 *            `look` swaps the whole character sprite (see data/looks.js);
 *            `hat` and `accessory` are SVG props drawn over it.
 * `art`    — key looked up by the renderer: LOOKS_BY_ID for looks,
 *            HAT_ART / ACCESSORY_ART in components/BerryArt.jsx for props
 * `source` — blindbox | destination | milestone | starter
 */

export const RARITY_LABEL = {
  common: 'Common',
  rare: 'Rare',
  epic: 'Epic'
}

export const COSMETICS = [
  /* ---- looks: full sprite swaps ---- */
  {
    id: 'everyday',
    name: 'Everyday Berry',
    slot: 'look',
    art: 'everyday',
    rarity: 'common',
    source: 'starter'
  },
  {
    id: 'crew',
    name: 'UO Cabin Crew Berry',
    slot: 'look',
    art: 'crew',
    rarity: 'epic',
    source: 'blindbox'
  },
  {
    id: 'pilot',
    name: 'UO Pilot Berry',
    slot: 'look',
    art: 'pilot',
    rarity: 'epic',
    source: 'milestone',
    note: '30-day check-in exclusive'
  },

  /* ---- blindbox props ---- */
  { id: 'captain-cap', name: 'Captain Cap', slot: 'hat', art: 'captainCap', rarity: 'rare', source: 'blindbox' },
  { id: 'beanie', name: 'Cosy Beanie', slot: 'hat', art: 'beanie', rarity: 'common', source: 'blindbox' },
  { id: 'party-hat', name: 'Party Hat', slot: 'hat', art: 'partyHat', rarity: 'common', source: 'blindbox' },
  { id: 'headphones', name: 'Flight Headphones', slot: 'hat', art: 'headphones', rarity: 'rare', source: 'blindbox' },
  { id: 'sunnies', name: 'Runway Sunnies', slot: 'accessory', art: 'sunnies', rarity: 'common', source: 'blindbox' },
  { id: 'neck-pillow', name: 'Neck Pillow', slot: 'accessory', art: 'neckPillow', rarity: 'common', source: 'blindbox' },
  { id: 'camera', name: 'Travel Camera', slot: 'accessory', art: 'camera', rarity: 'rare', source: 'blindbox' },
  { id: 'scarf', name: 'Winter Scarf', slot: 'accessory', art: 'scarf', rarity: 'common', source: 'blindbox' },

  /* City-flavoured props. These were per-city exclusives before the network
     grew to 35 destinations; exclusives are per-country now, so rather than
     retire finished art they deepen the blindbox pool. */
  { id: 'takoyaki-hat', name: 'Takoyaki Hat', slot: 'hat', art: 'takoyaki', rarity: 'rare', source: 'blindbox' },
  { id: 'ramen-bowl', name: 'Ramen Hat', slot: 'hat', art: 'ramen', rarity: 'rare', source: 'blindbox' },
  { id: 'jeju-hat', name: 'Island Straw Hat', slot: 'hat', art: 'strawHat', rarity: 'rare', source: 'blindbox' },
  { id: 'shell-necklace', name: 'Shell Necklace', slot: 'accessory', art: 'shellNecklace', rarity: 'rare', source: 'blindbox' },
  { id: 'snorkel', name: 'Snorkel Set', slot: 'accessory', art: 'snorkel', rarity: 'rare', source: 'blindbox' },
  { id: 'lantern', name: 'Paper Lantern', slot: 'accessory', art: 'lantern', rarity: 'rare', source: 'blindbox' },

  /* ---- country exclusives (first landing in that country) ---- */
  { id: 'japan-hachimaki', name: 'Japan Hachimaki', slot: 'hat', art: 'hachimaki', rarity: 'epic', source: 'country' },
  { id: 'korea-gat', name: 'Korean Gat', slot: 'hat', art: 'gat', rarity: 'epic', source: 'country' },
  { id: 'panda-hood', name: 'Mainland Panda Hood', slot: 'hat', art: 'pandaHood', rarity: 'epic', source: 'country' },
  { id: 'bubble-tea', name: 'Taiwan Bubble Tea', slot: 'accessory', art: 'bubbleTea', rarity: 'epic', source: 'country' },
  { id: 'batik-bandana', name: 'Malaysia Batik Bandana', slot: 'hat', art: 'bandana', rarity: 'epic', source: 'country' },
  { id: 'salakot', name: 'Philippines Salakot', slot: 'hat', art: 'salakot', rarity: 'epic', source: 'country' },
  { id: 'thai-garland', name: 'Thailand Garland', slot: 'accessory', art: 'garland', rarity: 'epic', source: 'country' },
  { id: 'conical-hat', name: 'Vietnam Nón Lá', slot: 'hat', art: 'conical', rarity: 'epic', source: 'country' },

  /* ---- room backgrounds and digital goods, bought in the shop ----
     Backgrounds are CSS themes rather than art files: BerryRoom applies
     `room--<id>` and the stylesheet recolours the wall, window and floor. */
  { id: 'bg-clouds', name: 'Above the Clouds', slot: 'background', rarity: 'common', source: 'shop' },
  { id: 'bg-sakura', name: 'Sakura Season', slot: 'background', rarity: 'rare', source: 'shop' },
  { id: 'bg-island', name: 'Island Getaway', slot: 'background', rarity: 'rare', source: 'shop' },
  { id: 'bg-seoul', name: 'Seoul Nights', slot: 'background', rarity: 'rare', source: 'shop' },
  { id: 'bg-cabin', name: 'Cabin Class', slot: 'background', rarity: 'epic', source: 'shop' }
]

/** The room theme shown when nothing else is equipped. */
export const DEFAULT_BACKGROUND = 'bg-home'

export const MILESTONE_ITEM_ID = 'pilot'
export const STARTER_ITEM_ID = 'everyday'

/**
 * Basic items handed out by daily check-in (from the brief). Berry can be fed
 * or washed with these — see FEED_REWARDS in state/store.jsx.
 */
export const BASIC_ITEMS = [
  { id: 'berry-snack', name: 'Berry Snack', emoji: '🍪', kind: 'feed', note: 'Berry’s favourite' },
  { id: 'berry-juice', name: 'Berry Juice', emoji: '🧃', kind: 'feed', note: 'A little energy boost' },
  { id: 'berry-soap', name: 'Berry Soap', emoji: '🧼', kind: 'wash', note: 'Keeps Berry fluffy' }
]

export const BLINDBOX_POOL = COSMETICS.filter((i) => i.source === 'blindbox')

export const ITEMS_BY_ID = Object.fromEntries(COSMETICS.map((i) => [i.id, i]))
export const BASIC_ITEMS_BY_ID = Object.fromEntries(BASIC_ITEMS.map((i) => [i.id, i]))

export const SLOTS = [
  { id: 'look', label: 'Look' },
  { id: 'hat', label: 'Head' },
  { id: 'accessory', label: 'Accessory' },
  { id: 'background', label: 'Room' }
]
