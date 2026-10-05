import { LIFE_DEPARTMENTS } from "@/lib/life-content";

export function LifeDeptList() {
  return (
    <ul className="life-dept-list">
      {LIFE_DEPARTMENTS.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
}
