/**
 * data.js — ฐานข้อมูลอาหารทั้งหมด
 * หมวดหมู่ cat: breakfast | lunch | dinner | snack | vegetarian | protein
 */

const DB = [
  // ── อาหารเช้า ──
  { n:'โจ๊กไก่',                  cat:'breakfast', cal:280, pro:15,  carb:35, fat:8,   tip:'ย่อยง่าย อุดมด้วยโปรตีน',               veg:false },
  { n:'ข้าวต้มปลา',               cat:'breakfast', cal:320, pro:20,  carb:40, fat:10,  tip:'โปรตีนสูง มีแคลเซียม',                  veg:false },
  { n:'ขนมปังโฮลวีท+ไข่',        cat:'breakfast', cal:350, pro:18,  carb:30, fat:16,  tip:'ใยอาหารสูง วิตามินบี',                  veg:true  },
  { n:'ข้าวโพดต้ม',               cat:'breakfast', cal:180, pro:6,   carb:38, fat:2,   tip:'ใยอาหารสูง วิตามินซี',                  veg:true  },
  { n:'กล้วยหอม',                 cat:'breakfast', cal:120, pro:1.5, carb:30, fat:0.5, tip:'โพแทสเซียมสูง พลังงานเร็ว',             veg:true  },
  // 🆕 เมนูข้าวฟ่าง
  { n:'โจ๊กข้าวฟ่างอกไก่สับ',    cat:'breakfast', cal:275, pro:19,  carb:34, fat:6,   tip:'ธัญพืชไม่ขัดสี โปรตีนสูง กลูเตนฟรี',  veg:false, isNew:true },
  { n:'โจ๊กข้าวฟ่างฝักทอง',      cat:'breakfast', cal:230, pro:7,   carb:42, fat:4,   tip:'เบต้าแคโรทีนสูง ใยอาหารดี กลูเตนฟรี', veg:true,  isNew:true },
  { n:'โจ๊กข้าวฟ่างลูกเดือย',    cat:'breakfast', cal:245, pro:9,   carb:44, fat:4,   tip:'ใยอาหารสูง บำรุงระบบย่อยอาหาร',        veg:true,  isNew:true },
  { n:'ข้าวต้มข้าวฟ่างอกไก่สับ', cat:'breakfast', cal:295, pro:21,  carb:37, fat:7,   tip:'ธัญพืชไม่ขัดสี โปรตีนสูง ไขมันต่ำ',   veg:false, isNew:true },

  // ── อาหารกลางวัน ──
  { n:'ข้าวผัดกะเพรา',            cat:'lunch', cal:520, pro:25, carb:65, fat:18, tip:'โปรตีนครบถ้วน รสชาติดี',      veg:false },
  { n:'ส้มตำไทย',                 cat:'lunch', cal:180, pro:3,  carb:25, fat:8,  tip:'วิตามินซีสูง ใยอาหารดี',      veg:true  },
  { n:'แกงเขียวหวานไก่',         cat:'lunch', cal:380, pro:22, carb:15, fat:28, tip:'โปรตีนสูง รสเผ็ดร้อน',       veg:false },
  { n:'ยำวุ้นเส้น',               cat:'lunch', cal:220, pro:8,  carb:35, fat:6,  tip:'แคลอรี่ต่ำ ใยอาหารสูง',      veg:true  },
  { n:'ข้าวกล้องผัดผัก',         cat:'lunch', cal:420, pro:12, carb:70, fat:12, tip:'ใยอาหารสูง วิตามินครบถ้วน', veg:true  },

  // ── อาหารเย็น ──
  { n:'ปลาเผาเกลือ',              cat:'dinner', cal:280, pro:35, carb:0,  fat:15, tip:'โปรตีนสูง โอเมก้า 3',            veg:false },
  { n:'ไก่ย่าง',                  cat:'dinner', cal:320, pro:28, carb:8,  fat:20, tip:'โปรตีนสูง ไขมันดี',              veg:false },
  { n:'ต้มยำกุ้ง',                cat:'dinner', cal:180, pro:15, carb:10, fat:8,  tip:'โปรตีนสูง วิตามินซี',            veg:false },
  { n:'ผัดผักรวม',                cat:'dinner', cal:160, pro:6,  carb:20, fat:8,  tip:'วิตามินหลากหลาย ใยอาหารสูง',   veg:true  },

  // ── ของว่าง ──
  { n:'ผลไม้รวม',                 cat:'snack', cal:120, pro:2,  carb:30, fat:0.5, tip:'วิตามินซี ใยอาหาร',    veg:true },
  { n:'ถั่วลิสงคั่ว',             cat:'snack', cal:280, pro:12, carb:16, fat:20,  tip:'โปรตีนสูง ไขมันดี',    veg:true },
  { n:'โยเกิร์ตกรีก',             cat:'snack', cal:150, pro:15, carb:12, fat:4,   tip:'โปรตีนสูง โพรไบโอติก', veg:true },
  { n:'ไข่ต้ม',                   cat:'snack', cal:80,  pro:6,  carb:1,  fat:5,   tip:'โปรตีนครบถ้วน',        veg:true },

  // ── อาหารเจ ──
  { n:'เต้าหู้ทอด',               cat:'vegetarian', cal:240, pro:18, carb:8,  fat:16, tip:'โปรตีนพืช ไอโซฟลาโวน',   veg:true },
  { n:'ผัดผักบุ้งไฟแดง',         cat:'vegetarian', cal:180, pro:5,  carb:15, fat:12, tip:'เหล็กสูง วิตามินเอ',      veg:true },
  { n:'แกงเขียวหวานเห็ด',        cat:'vegetarian', cal:220, pro:8,  carb:15, fat:16, tip:'ใยอาหารสูง โปรตีนพืช',   veg:true },

  // ── โปรตีนสูง ──
  { n:'อกไก่ย่าง',                cat:'protein', cal:220, pro:40, carb:0, fat:6,  tip:'โปรตีนสูงมาก ไขมันต่ำ', veg:false },
  { n:'ปลาแซลมอนย่าง',           cat:'protein', cal:350, pro:35, carb:0, fat:22, tip:'โอเมก้า 3 สูง',          veg:false },
  { n:'เต้าหู้นุ่ม',              cat:'protein', cal:180, pro:20, carb:4, fat:10, tip:'โปรตีนพืช แคลเซียม',    veg:true  },
];
