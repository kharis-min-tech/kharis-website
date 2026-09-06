import { ImageResponse } from "next/og";

export const alt = "Kharis Phase 2 — Faith Looks Different Here";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#121014",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              background: "#ffde59",
              color: "#221b00",
              fontWeight: 800,
              padding: "10px 18px",
              fontSize: 22,
              letterSpacing: 3,
            }}
          >
            KP2
          </div>
          <div style={{ color: "#d2bbff", fontSize: 22, letterSpacing: 4 }}>
            KHARIS PHASE 2
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              color: "#ece6f0",
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: -2,
              textTransform: "uppercase",
            }}
          >
            Faith looks
            <br />
            different here.
          </div>
          <div style={{ color: "#cac4d0", fontSize: 28, maxWidth: 820 }}>
            Youth church. Worship, fellowships, events and the Word — across the UK.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#d2bbff",
            fontSize: 22,
          }}
        >
          <span>A Kharis Ministries church</span>
          <span
            style={{
              background: "#7c3aed",
              color: "#ffffff",
              padding: "12px 22px",
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            FIND A BRANCH
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
