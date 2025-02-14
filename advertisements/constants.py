
CATEGORY_CHOICES = [
    # Photography & Videography
    ('camera', 'Camera'),
    ('gimbal', 'Gimbal'),
    ('lighting', 'Lighting Equipment'),
    ('video_acc', 'Video Accessories'),
    ('microphone', 'Microphone'),
    ('studio_equip', 'Studio Equipment'),
    
    # Sports & Fitness
    ('bicycle', 'Bicycle'),
    ('safety_gear', 'Helmets & Safety Gear'),
    ('cricket', 'Cricket Equipment'),
    ('football', 'Football & Soccer Equipment'),
    ('basketball', 'Basketball Equipment'),
    ('tennis', 'Tennis Equipment'),
    ('gym_equip', 'Gym Equipment'),
    
    # Outdoor & Camping
    ('tent', 'Tent'),
    ('sleeping_bag', 'Sleeping Bag'),
    ('camp_furniture', 'Camping Furniture'),
    ('hiking_gear', 'Hiking Gear'),
    ('camp_stove', 'Portable Stove'),
    ('cooler', 'Cooler'),
    ('bag', 'Bag'),
    
    # Audio & Entertainment
    ('speaker', 'Speaker'),
    ('dj_equip', 'DJ Equipment'),
    ('musical_inst', 'Musical Instruments'),
    ('karaoke', 'Karaoke Systems'),
    ('party_lights', 'Party Lights'),
    ('projector', 'Projector'),
    
    # Electronics & Gadgets
    ('drone', 'Drone'),
    ('power_bank', 'Power Bank'),
    ('laptop', 'Laptop'),
    
    # Event & Party
    ('party_furniture', 'Tables & Chairs'),
    ('decorations', 'Decorations'),
    ('grill', 'Grills & BBQ Equipment'),
    ('stage', 'Portable Stage'),
    
    # Tools & Equipment
    ('power_tool', 'Power Tools'),
    ('hand_tool', 'Hand Tools'),
    ('garden_tool', 'Gardening Equipment'),
    ('ladder', 'Ladder'),
    ('paint_sprayer', 'Paint Sprayer'),
]

CATEGORY_GROUPS = {
    'Photography & Videography': ['camera', 'gimbal', 'lighting', 'video_acc', 'microphone', 'studio_equip'],
    'Sports & Fitness': ['bicycle', 'safety_gear', 'cricket', 'football', 'basketball', 'tennis', 'gym_equip'],
    'Outdoor & Camping': ['tent', 'sleeping_bag', 'camp_furniture', 'hiking_gear', 'camp_stove', 'cooler', 'bag'],
    'Audio & Entertainment': ['speaker', 'dj_equip', 'musical_inst', 'karaoke', 'party_lights', 'projector'],
    'Electronics & Gadgets': ['drone', 'power_bank', 'laptop'],
    'Event & Party': ['party_furniture', 'decorations', 'grill', 'stage'],
    'Tools & Equipment': ['power_tool', 'hand_tool', 'garden_tool', 'ladder', 'paint_sprayer'],
}