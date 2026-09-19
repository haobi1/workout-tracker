import React, { useState, useEffect, useRef } from 'react';

const BILI = 'https://www.bilibili.com/opus/821531560710766600';

const PLAN = {
  A: {
    label: 'Day A',
    focus: '推 · 胸 / 肩 / 三头',
    accent: '#C6501F',
    exercises: [
      { name: '哑铃卧推', note: '平板，垫地板或长凳', sets: 4, reps: '8-10', weight: '12-15kg/只', startWeight: '12kg', videoTime: '02:17' },
      { name: '哑铃上斜飞鸟', note: '', sets: 3, reps: '10-12', weight: '6-8kg/只', startWeight: '6kg', videoTime: '05:36' },
      { name: '哑铃肩上推举', note: '', sets: 3, reps: '8-10', weight: '8-10kg/只', startWeight: '8kg', videoTime: '09:49' },
      { name: '哑铃侧平举', note: '', sets: 3, reps: '12-15', weight: '4-6kg/只', startWeight: '4kg', videoTime: '11:26' },
      { name: '哑铃三头臂屈伸', note: '单臂或双手过头', sets: 3, reps: '10-12', weight: '8-10kg', startWeight: '8kg', videoTime: '21:42' },
    ],
  },
  B: {
    label: 'Day B',
    focus: '拉 · 背 / 二头',
    accent: '#2B5D4F',
    exercises: [
      { name: '哑铃单臂划船', note: '', sets: 4, reps: '10-12', weight: '12-15kg', startWeight: '12kg', videoTime: '07:34' },
      { name: '哑铃俯身划船', note: '双臂', sets: 3, reps: '10-12', weight: '10-12kg/只', startWeight: '10kg', videoTime: '06:32' },
      { name: '哑铃硬拉', note: '罗马尼亚硬拉，练背下+臀腿', sets: 3, reps: '10', weight: '12-15kg/只', startWeight: '12kg', videoTime: '14:55' },
      { name: '哑铃反向飞鸟', note: '练后三角，改善圆肩', sets: 3, reps: '12-15', weight: '3-5kg/只', startWeight: '3kg', videoTime: '13:00' },
      { name: '哑铃二头弯举', note: '', sets: 3, reps: '10-12', weight: '8-10kg/只', startWeight: '8kg', videoTime: '19:19' },
    ],
  },
};

const CORE = [
  { name: '哑铃负重卷腹', note: '平躺，哑铃抱胸前或伸直举过头顶增加难度', sets: 3, reps: '12-15', weight: '5-8kg', startWeight: '5kg' },
  { name: '俄罗斯转体', note: '坐姿，上身后倾，转体触地，可持哑铃', sets: 3, reps: '20（左右各10次）', weight: '3-5kg', startWeight: '3kg' },
  { name: '哑铃负重仰卧起坐', note: '腹肌力量足够时再加，动作要标准别甩腰', sets: 3, reps: '10-12', weight: '5-8kg', startWeight: '5kg' },
  { name: '平板支撑', note: '不用哑铃，练核心稳定性', sets: 3, reps: '30-45秒', weight: '徒手', startWeight: '徒手' },
];

const WEEK_NOTES = {
  1: '减重30%试重，找回动作感觉，别练到力竭',
  2: '加回目标重量，每组留1-2次余力',
  3: '若能轻松完成，每个动作加2.5kg',
  4: '继续渐进，顶格挑战',
};

function useRestTimer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [duration, setDuration] = useState(90);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            setRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, seconds]);

  const start = (d) => {
    setDuration(d);
    setSeconds(d);
    setRunning(true);
  };
  const stop = () => {
    setRunning(false);
    setSeconds(0);
  };

  return { seconds, running, duration, start, stop };
}

export default function WorkoutTracker() {
  const [day, setDay] = useState('A');
  const [week, setWeek] = useState(1);
  const [checked, setChecked] = useState({});
  const timer = useRestTimer();

  const plan = PLAN[day];

  const toggleSet = (exIdx, setIdx) => {
    const key = `${day}-${exIdx}-${setIdx}`;
    setChecked((c) => ({ ...c, [key]: !c[key] }));
  };

  const toggleCoreSet = (exIdx, setIdx) => {
    const key = `core-${exIdx}-${setIdx}`;
    setChecked((c) => ({ ...c, [key]: !c[key] }));
  };

  const totalSets = plan.exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const doneSets = plan.exercises.reduce(
    (sum, ex, exIdx) =>
      sum +
      Array.from({ length: ex.sets }).filter((_, setIdx) => checked[`${day}-${exIdx}-${setIdx}`])
        .length,
    0
  );

  const fmtTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div style={{ backgroundColor: '#F7F4EE', minHeight: '100vh', fontFamily: "'Georgia', 'Songti SC', serif" }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 20px 100px' }}>
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, letterSpacing: 1, color: '#8A8478', marginBottom: 4 }}>
            四周渐进计划 · 第 {week} 周
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#2A2620', margin: 0, lineHeight: 1.3 }}>
            哑铃训练卡
          </h1>
        </div>

        {/* Week selector */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {[1, 2, 3, 4].map((w) => (
            <button
              key={w}
              onClick={() => setWeek(w)}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 6,
                border: week === w ? 'none' : '1px solid #DAD4C6',
                backgroundColor: week === w ? '#2A2620' : 'transparent',
                color: week === w ? '#F7F4EE' : '#5C5648',
                fontSize: 14,
                fontFamily: 'inherit',
                cursor: 'pointer',
              }}
            >
              第{w}周
            </button>
          ))}
        </div>
        <div
          style={{
            fontSize: 13,
            color: '#6B6558',
            backgroundColor: '#EFE9DB',
            padding: '10px 12px',
            borderRadius: 6,
            marginBottom: 20,
            lineHeight: 1.5,
          }}
        >
          {WEEK_NOTES[week]}
        </div>

        {/* Day tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {Object.keys(PLAN).map((d) => (
            <button
              key={d}
              onClick={() => setDay(d)}
              style={{
                flex: 1,
                padding: '14px 0',
                borderRadius: 8,
                border: 'none',
                backgroundColor: day === d ? PLAN[d].accent : '#EFE9DB',
                color: day === d ? '#FBF8F1' : '#5C5648',
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'left',
                paddingLeft: 16,
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 700 }}>{PLAN[d].label}</div>
              <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>{PLAN[d].focus}</div>
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#8A8478', marginBottom: 6 }}>
            <span>训练进度</span>
            <span>{doneSets} / {totalSets} 组</span>
          </div>
          <div style={{ height: 6, backgroundColor: '#EFE9DB', borderRadius: 3, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${totalSets ? (doneSets / totalSets) * 100 : 0}%`,
                backgroundColor: plan.accent,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Exercises */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {plan.exercises.map((ex, exIdx) => (
            <div
              key={ex.name}
              style={{
                backgroundColor: '#FFFEFB',
                border: '1px solid #E8E2D3',
                borderRadius: 10,
                padding: 16,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#2A2620' }}>{ex.name}</div>
                <div style={{ fontSize: 13, color: plan.accent, fontWeight: 700 }}>{ex.startWeight}</div>
              </div>
              {ex.note && (
                <div style={{ fontSize: 12, color: '#9A9384', marginBottom: 8 }}>{ex.note}</div>
              )}
              <div style={{ fontSize: 13, color: '#6B6558', marginBottom: 10 }}>
                {ex.sets} 组 × {ex.reps} 次 <span style={{ color: '#B0AA9B' }}>· 建议 {ex.weight}</span>
              </div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                {Array.from({ length: ex.sets }).map((_, setIdx) => {
                  const key = `${day}-${exIdx}-${setIdx}`;
                  const isChecked = !!checked[key];
                  return (
                    <button
                      key={setIdx}
                      onClick={() => toggleSet(exIdx, setIdx)}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        border: isChecked ? 'none' : '1.5px solid #DAD4C6',
                        backgroundColor: isChecked ? plan.accent : 'transparent',
                        color: isChecked ? '#FBF8F1' : '#9A9384',
                        fontSize: 13,
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                      }}
                    >
                      {setIdx + 1}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <button
                  onClick={() => timer.start(90)}
                  style={{
                    fontSize: 12,
                    color: plan.accent,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    fontFamily: 'inherit',
                  }}
                >
                  开始组间休息 ↺
                </button>
                <a
                  href={BILI}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 12,
                    color: '#9A9384',
                    textDecoration: 'none',
                    borderBottom: '1px solid #DAD4C6',
                  }}
                >
                  看示范 ({ex.videoTime})
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Core section */}
        <div style={{ marginTop: 28, marginBottom: 10 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#2A2620' }}>核心训练</div>
          <div style={{ fontSize: 12, color: '#9A9384', marginTop: 2 }}>
            可选 · 加在任意一天末尾，一周2次左右就够
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {CORE.map((ex, exIdx) => (
            <div
              key={ex.name}
              style={{
                backgroundColor: '#FBF9F3',
                border: '1px dashed #DAD4C6',
                borderRadius: 10,
                padding: 16,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#2A2620' }}>{ex.name}</div>
                <div style={{ fontSize: 13, color: '#6B6558', fontWeight: 700 }}>{ex.startWeight}</div>
              </div>
              {ex.note && (
                <div style={{ fontSize: 12, color: '#9A9384', marginBottom: 8 }}>{ex.note}</div>
              )}
              <div style={{ fontSize: 13, color: '#6B6558', marginBottom: 10 }}>
                {ex.sets} 组 × {ex.reps}
              </div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                {Array.from({ length: ex.sets }).map((_, setIdx) => {
                  const key = `core-${exIdx}-${setIdx}`;
                  const isChecked = !!checked[key];
                  return (
                    <button
                      key={setIdx}
                      onClick={() => toggleCoreSet(exIdx, setIdx)}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        border: isChecked ? 'none' : '1.5px solid #DAD4C6',
                        backgroundColor: isChecked ? '#6B6558' : 'transparent',
                        color: isChecked ? '#FBF8F1' : '#9A9384',
                        fontSize: 13,
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                      }}
                    >
                      {setIdx + 1}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => timer.start(60)}
                style={{
                  fontSize: 12,
                  color: '#6B6558',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  fontFamily: 'inherit',
                }}
              >
                开始组间休息 ↺
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, fontSize: 12, color: '#9A9384', lineHeight: 1.6 }}>
          训练前用 2.5-5kg 轻重量做 5 分钟热身 · 组间休息 60-90 秒，复合动作可延长至 90-120 秒
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: '#B0AA9B', lineHeight: 1.6 }}>
          "看示范"跳转到同一个教学视频，括号内是该动作在视频中的时间点，打开后手动拖到对应位置即可
        </div>
      </div>

      {/* Rest timer floating bar */}
      {timer.seconds > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#2A2620',
            color: '#F7F4EE',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: 480,
            margin: '0 auto',
            borderRadius: '12px 12px 0 0',
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: '#B0AA9B' }}>组间休息</div>
            <div style={{ fontSize: 24, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
              {fmtTime(timer.seconds)}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => timer.start(60)}
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #4A4438',
                backgroundColor: 'transparent',
                color: '#F7F4EE',
                fontSize: 12,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              60s
            </button>
            <button
              onClick={() => timer.start(90)}
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #4A4438',
                backgroundColor: 'transparent',
                color: '#F7F4EE',
                fontSize: 12,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              90s
            </button>
            <button
              onClick={timer.stop}
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                border: 'none',
                backgroundColor: '#C6501F',
                color: '#FBF8F1',
                fontSize: 12,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              跳过
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
