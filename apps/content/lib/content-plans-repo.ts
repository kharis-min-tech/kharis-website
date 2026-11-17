import { studioData } from "@/lib/studio-data";
import {
  CONTENT_PLANS_KEY,
  emptyContentPlansStore,
  normalizeContentPlan,
  parseContentPlansStore,
  type ContentPlan,
  type ContentPlansStore,
} from "./content-plans";

async function getStore(): Promise<ContentPlansStore> {
  const [row] = await studioData.list<{ value: unknown }>("app_config", {
    where: { key: CONTENT_PLANS_KEY },
    limit: 1,
  });
  if (!row) return emptyContentPlansStore();
  return parseContentPlansStore(row.value);
}

async function saveStore(store: ContentPlansStore) {
  const now = new Date().toISOString();
  const plans = store.plans.map((plan) => normalizeContentPlan(plan, now));
  await studioData.upsert("app_config", {
    key: CONTENT_PLANS_KEY,
    value: { plans },
  });
  return { plans } satisfies ContentPlansStore;
}

export async function listContentPlans() {
  const store = await getStore();
  return store.plans;
}

export async function saveContentPlan(plan: ContentPlan) {
  const store = await getStore();
  const normalized = normalizeContentPlan(plan);
  const index = store.plans.findIndex((item) => item.id === normalized.id);
  const plans =
    index >= 0
      ? store.plans.map((item, i) => (i === index ? normalized : item))
      : [...store.plans, normalized];
  const saved = await saveStore({ plans });
  return saved.plans.find((item) => item.id === normalized.id) ?? normalized;
}

export async function deleteContentPlan(id: string) {
  const store = await getStore();
  const plans = store.plans.filter((plan) => plan.id !== id);
  await saveStore({ plans });
}
