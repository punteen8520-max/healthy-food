/**
 * app.js — ตรรกะทั้งหมด
 * ต้องโหลด data.js ก่อนไฟล์นี้เสมอ
 */

// ─────────────────────────────────────────────
// State
// ─────────────────────────────────────────────
let sel = []; // index ของ DB ที่ผู้ใช้เลือก

// ─────────────────────────────────────────────
// Tabs
// ─────────────────────────────────────────────
function switchTab(id, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
  if (id === 'food-tab') renderFoods();
}

// ─────────────────────────────────────────────
// Food Selector
// ─────────────────────────────────────────────
function getFiltered() {
  const cat = document.getElementById('food-category').value;
  const low = document.getElementById('f-low').checked;
  const pro = document.getElementById('f-pro').checked;
  const veg = document.getElementById('f-veg').checked;
  return DB.filter(f => {
    if (cat && f.cat !== cat) return false;
    if (low && f.cal >= 300)  return false;
    if (pro && f.pro < 15)    return false;
    if (veg && !f.veg)        return false;
    return true;
  });
}

function renderFoods() {
  const list = getFiltered();
  const grid = document.getElementById('food-grid');
  grid.innerHTML = '';
  list.forEach(f => {
    const idx   = DB.indexOf(f);
    const isSel = sel.includes(idx);
    const card  = document.createElement('div');
    card.className = 'food-card' + (isSel ? ' selected' : '');
    card.onclick   = () => toggle(idx);
    card.innerHTML = `
      <div class="food-top">
        <div class="food-name">${f.n}${f.isNew ? '<span class="new-badge">ใหม่</span>' : ''}</div>
        <div class="cal-badge">${f.cal} cal</div>
      </div>
      <div class="food-macro">โปรตีน ${f.pro}g | คาร์บ ${f.carb}g | ไขมัน ${f.fat}g</div>
      <div class="food-benefit"><strong>ประโยชน์:</strong> ${f.tip}</div>`;
    grid.appendChild(card);
  });
}

function toggle(idx) {
  const i = sel.indexOf(idx);
  if (i > -1) sel.splice(i, 1);
  else sel.push(idx);
  updateSummary();
  renderFoods();
}

function updateSummary() {
  const box = document.getElementById('sel-summary');
  if (!sel.length) { box.style.display = 'none'; return; }
  box.style.display = 'block';

  let cal = 0, pro = 0, carb = 0, fat = 0;
  sel.forEach(i => { cal += DB[i].cal; pro += DB[i].pro; carb += DB[i].carb; fat += DB[i].fat; });

  document.getElementById('s-cal').textContent  = cal + ' แคลอรี่';
  document.getElementById('s-count').textContent = sel.length;
  document.getElementById('s-pro').textContent   = Math.round(pro  * 10) / 10;
  document.getElementById('s-carb').textContent  = Math.round(carb * 10) / 10;
  document.getElementById('s-fat').textContent   = Math.round(fat  * 10) / 10;

  // Macro bar
  const pc = pro * 4, cc = carb * 4, fc = fat * 9;
  const tot = pc + cc + fc || 1;
  const pp = pc / tot * 100, cp = cc / tot * 100, fp = fc / tot * 100;
  document.getElementById('macro-bar').innerHTML = `
    <div class="macro-seg" style="flex:${pp};background:#667eea">${pp > 10 ? Math.round(pp) + '%' : ''}</div>
    <div class="macro-seg" style="flex:${cp};background:#48bb78">${cp > 10 ? Math.round(cp) + '%' : ''}</div>
    <div class="macro-seg" style="flex:${fp};background:#f6ad55">${fp > 10 ? Math.round(fp) + '%' : ''}</div>`;
  document.getElementById('macro-legend').innerHTML = `
    <span><span class="dot" style="background:#667eea"></span>โปรตีน</span>
    <span><span class="dot" style="background:#48bb78"></span>คาร์บ</span>
    <span><span class="dot" style="background:#f6ad55"></span>ไขมัน</span>`;
}

function clearSel() {
  sel = [];
  updateSummary();
  renderFoods();
  notify('ล้างการเลือกแล้ว');
}

// ─────────────────────────────────────────────
// Meal Plan
// ─────────────────────────────────────────────
const DAYS  = ['จ.','อ.','พ.','พฤ.','ศ.','ส.','อา.'];
const SLOTS = [
  { title:'อาหารเช้า',    icon:'🌅', cats:['breakfast'] },
  { title:'อาหารกลางวัน', icon:'☀️', cats:['lunch'] },
  { title:'ของว่าง',      icon:'🍎', cats:['snack'] },
  { title:'อาหารเย็น',    icon:'🌙', cats:['dinner','vegetarian','protein'] },
];

function pick(cats, prefer) {
  const pool = DB.filter(f => cats.includes(f.cat));
  if (prefer === 'lose') {
    const lc = pool.filter(f => f.cal < 300);
    if (lc.length) return lc[Math.floor(Math.random() * lc.length)];
  }
  if (prefer === 'gain') {
    const hp = pool.filter(f => f.pro >= 15);
    if (hp.length) return hp[Math.floor(Math.random() * hp.length)];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

function genPlan(goal) {
  const planData = [];
  let totalCal   = 0;

  for (let d = 0; d < 7; d++) {
    const day = { meals: [] };
    let dc = 0;
    SLOTS.forEach(s => {
      const f = pick(s.cats, goal);
      day.meals.push({ slot: s, food: f });
      dc += f ? f.cal : 0;
    });
    totalCal += dc;
    day.total = dc;
    planData.push(day);
  }

  const avg     = Math.round(totalCal / 7);
  const goalTxt = goal === 'lose' ? 'เป้าหมาย: ลดน้ำหนัก — เน้นแคลอรี่ต่ำ'
                : goal === 'gain' ? 'เป้าหมาย: เพิ่มกล้ามเนื้อ — เน้นโปรตีนสูง'
                :                  'เป้าหมาย: สุขภาพสมดุล';

  document.getElementById('plan-cal').textContent = '~' + avg + ' แคลอรี่/วัน (เฉลี่ย)';
  document.getElementById('plan-sub').textContent  = goalTxt;

  const tabsEl   = document.getElementById('day-tabs');
  const panelsEl = document.getElementById('day-panels');
  tabsEl.innerHTML   = '';
  panelsEl.innerHTML = '';

  planData.forEach((day, i) => {
    // Day tab button
    const btn = document.createElement('button');
    btn.className   = 'day-btn' + (i === 0 ? ' active' : '');
    btn.textContent = DAYS[i];
    btn.onclick = () => {
      document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.day-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('dp-' + i).classList.add('active');
    };
    tabsEl.appendChild(btn);

    // Day panel
    const panel = document.createElement('div');
    panel.id        = 'dp-' + i;
    panel.className = 'day-panel' + (i === 0 ? ' active' : '');
    panel.innerHTML = `
      <div class="meal-slots">
        ${day.meals.map(m => `
          <div class="meal-slot">
            <div class="slot-header">
              <span class="slot-icon">${m.slot.icon}</span>
              <span class="slot-title">${m.slot.title}</span>
            </div>
            <div class="meal-item">
              <span class="meal-item-name">${m.food ? m.food.n : '—'}</span>
              <span class="cal-badge">${m.food ? m.food.cal : 0}</span>
            </div>
            ${m.food
              ? `<div style="font-size:.78rem;color:#718096;margin-top:6px">
                   โปรตีน ${m.food.pro}g | คาร์บ ${m.food.carb}g | ไขมัน ${m.food.fat}g
                 </div>`
              : ''}
          </div>`).join('')}
      </div>
      <div style="text-align:right;margin-top:12px;font-weight:700;color:#667eea;font-size:.9rem">
        รวมวันนี้: ${day.total} แคลอรี่
      </div>`;
    panelsEl.appendChild(panel);
  });

  document.getElementById('plan-out').style.display = 'block';
  notify('สร้างแผนอาหารเสร็จแล้ว 🎉');
}

// ─────────────────────────────────────────────
// BMI Calculator
// ─────────────────────────────────────────────
function calcBMI() {
  const w = parseFloat(document.getElementById('bmi-w').value);
  const h = parseFloat(document.getElementById('bmi-h').value);
  if (!w || !h || w <= 0 || h <= 0) { notify('กรุณากรอกข้อมูลให้ครบ', 'err'); return; }

  const bmi = w / Math.pow(h / 100, 2);
  let cat, color, adv;

  if      (bmi < 18.5) { cat = 'น้ำหนักต่ำกว่าเกณฑ์'; color = '#3182ce'; adv = 'ควรเพิ่มน้ำหนักด้วยอาหารที่มีประโยชน์และเสริมสร้างกล้ามเนื้อ'; }
  else if (bmi < 25)   { cat = 'น้ำหนักปกติ ✅';       color = '#38a169'; adv = 'น้ำหนักอยู่ในเกณฑ์ดี รักษาไว้ด้วยการกินอาหารดีและออกกำลังกายสม่ำเสมอ'; }
  else if (bmi < 30)   { cat = 'น้ำหนักเกิน';          color = '#d69e2e'; adv = 'ควรลดน้ำหนักด้วยการควบคุมอาหารและเพิ่มการออกกำลังกาย'; }
  else                 { cat = 'อ้วน';                 color = '#e53e3e'; adv = 'ควรปรึกษาแพทย์เพื่อวางแผนลดน้ำหนักอย่างปลอดภัย'; }

  const pct = Math.min((bmi / 40) * 100, 100);
  document.getElementById('bmi-val').textContent       = bmi.toFixed(1);
  document.getElementById('bmi-val').style.color       = color;
  document.getElementById('bmi-cat').textContent       = cat;
  document.getElementById('bmi-cat').style.color       = color;
  document.getElementById('bmi-bar').style.cssText     = 'width:' + pct + '%;background:' + color;
  document.getElementById('bmi-adv').innerHTML         = '<strong>คำแนะนำ:</strong> ' + adv;
  document.getElementById('bmi-res').style.display     = 'block';
  notify('คำนวณ BMI เสร็จแล้ว');
}

// ─────────────────────────────────────────────
// Daily Calorie Calculator  (Mifflin-St Jeor)
// ─────────────────────────────────────────────
function calcCal() {
  const w    = parseFloat(document.getElementById('c-w').value);
  const h    = parseFloat(document.getElementById('c-h').value);
  const age  = parseFloat(document.getElementById('c-age').value);
  const sex  = document.getElementById('c-sex').value;
  const act  = parseFloat(document.getElementById('c-act').value);
  const goal = document.getElementById('c-goal').value;

  if (!w || !h || !age || !sex || !act || !goal) {
    notify('กรุณากรอกข้อมูลให้ครบ', 'err');
    return;
  }

  const bmr = sex === 'm'
    ? 88.362  + 13.397 * w + 4.799 * h - 5.677 * age
    : 447.593 +  9.247 * w + 3.098 * h - 4.330 * age;

  let tdee = bmr * act;
  if (goal === 'lose') tdee -= 500;
  if (goal === 'gain') tdee += 500;

  const pro  = (tdee * 0.25) / 4;
  const carb = (tdee * 0.45) / 4;
  const fat  = (tdee * 0.30) / 9;

  document.getElementById('c-total').textContent       = Math.round(tdee) + ' แคลอรี่/วัน';
  document.getElementById('c-bmr').textContent         = Math.round(bmr);
  document.getElementById('c-pro-out').textContent     = Math.round(pro)  + 'g';
  document.getElementById('c-carb-out').textContent    = Math.round(carb) + 'g';
  document.getElementById('c-fat-out').textContent     = Math.round(fat)  + 'g';
  document.getElementById('cal-res').style.display     = 'block';
  notify('คำนวณเสร็จแล้ว');
}

// ─────────────────────────────────────────────
// Notification
// ─────────────────────────────────────────────
function notify(msg, type) {
  const el = document.getElementById('notif');
  el.textContent   = msg;
  el.style.background = type === 'err'
    ? 'linear-gradient(135deg,#fc8181,#e53e3e)'
    : 'linear-gradient(135deg,#48bb78,#38a169)';
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2800);
}

// ─────────────────────────────────────────────
// Init
// ─────────────────────────────────────────────
renderFoods();
