export function DepartmentIllustration({ department }: { department: string }) {
  if (department !== "Children's Department") return null;

  return (
    <>
      <img
        src="https://images.kharis.org/site-images/kp2/43bd4a0c466fb815/illustrations/childrens-ministry-v2.webp"
        alt="Illustration of a teacher sharing a Bible story with children"
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      <span className="pointer-events-none absolute inset-0 bg-black/20" aria-hidden="true" />
    </>
  );
}
