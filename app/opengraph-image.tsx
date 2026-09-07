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
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
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
          <div
            style={{
              display: "flex",
              color: "#d2bbff",
              fontSize: 22,
              letterSpacing: 4,
              marginLeft: 16,
            }}
          >
            KHARIS PHASE 2
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              color: "#ece6f0",
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: -2,
              textTransform: "uppercase",
            }}
          >
            <div style={{ display: "flex" }}>Faith looks</div>
            <div style={{ display: "flex" }}>different here.</div>
          </div>
          <div
            style={{
              display: "flex",
              color: "#cac4d0",
              fontSize: 28,
              maxWidth: 820,
              marginTop: 20,
            }}
          >
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
          <div style={{ display: "flex" }}>A Kharis Ministries church</div>
          <div
            style={{
              display: "flex",
              background: "#7c3aed",
              color: "#ffffff",
              padding: "12px 22px",
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            FIND A BRANCH
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
