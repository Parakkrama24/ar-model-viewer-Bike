import { Html } from "@react-three/drei"
import { useMemo } from "react"
import { Vector3, Quaternion } from "three"

const SPECS = [
  { label: "Engine",  value: "750 cc" },
  { label: "Length",  value: "2.29 m" },
  { label: "Height",  value: "1.29 m" },
  { label: "Width",   value: "0.87 m" },
  { label: "Weight",  value: "178 kg" },
]

export default function ARInfoCard({ placedMatrix, visible, onClose }) {
  const position = useMemo(() => {
    if (!placedMatrix) return [0, 0, 0]
    const pos  = new Vector3()
    const quat = new Quaternion()
    const scl  = new Vector3()
    placedMatrix.decompose(pos, quat, scl)
    return [pos.x, pos.y + 1.4, pos.z]
  }, [placedMatrix])

  if (!visible || !placedMatrix) return null

  return (
    <Html
      position={position}
      center
      distanceFactor={4}
      occlude={false}
      zIndexRange={[100, 0]}
    >
      <div style={{
        width: "290px",
        borderRadius: "22px",
        overflow: "hidden",
        background: "rgba(8, 10, 24, 0.82)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(99, 179, 237, 0.25)",
        boxShadow: "0 32px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,179,237,0.12), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 40px rgba(59,130,246,0.15)",
        fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
        color: "#ffffff",
        pointerEvents: "auto",
        userSelect: "none",
      }}>

        <div style={{ position: "relative" }}>
          <img
            src="/models/model_101/Image.png"
            alt="Bike Model 01"
            style={{ width: "100%", height: "155px", objectFit: "cover", display: "block" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(8,10,24,0.9) 0%, transparent 55%)",
          }} />
          <div style={{
            position: "absolute", top: "10px", right: "10px",
            padding: "4px 10px", borderRadius: "20px",
            background: "rgba(59,130,246,0.85)", backdropFilter: "blur(8px)",
            fontSize: "11px", fontWeight: "700", letterSpacing: "0.05em", color: "#fff",
          }}>AR</div>
        </div>

        <div style={{ padding: "16px 20px 20px" }}>
          <div style={{ marginBottom: "14px" }}>
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700", letterSpacing: "-0.3px", lineHeight: 1.2 }}>
              Bike Model 01
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "rgba(147,197,253,0.8)", fontWeight: "500", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Premium Motorcycle
            </p>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "12px" }}>
            {SPECS.map(({ label, value }, i) => (
              <div key={label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 0",
                borderBottom: i < SPECS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", fontWeight: "500" }}>{label}</span>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#93c5fd" }}>{value}</span>
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            style={{
              marginTop: "16px", width: "100%", padding: "13px",
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              border: "none", borderRadius: "14px", color: "#ffffff",
              fontSize: "14px", fontWeight: "700", cursor: "pointer",
              letterSpacing: "0.02em", boxShadow: "0 4px 20px rgba(59,130,246,0.4)",
            }}
          >
            ✕  Close Info
          </button>
        </div>
      </div>
    </Html>
  )
}
