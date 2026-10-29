import Link from "next/link";
import { ConfirmBadge } from "./ConfirmBadge";

const QUESTIONS: readonly {
  question: string;
  confirm: string;
  note?: string;
  link?: { href: string; label: string };
}[] = [
  {
    question: "Is it safe? Who looks after my child?",
    confirm: "Plain-language safeguarding: who looks after a child. Leadership still has to supply the wording.",
    link: { href: "/governance#safeguarding", label: "Safeguarding policy" },
  },
  {
    question: "What if my child is nervous on the first visit?",
    confirm: "How a nervous child is settled, and whether a parent can stay for the first visit.",
  },
  {
    question: "Which group is right for my child?",
    note: "Kinder is 3–6, Super is 7–11 and Transition is 12–16.",
    confirm: "Which group a child joins when their birthday falls on the boundary.",
  },
  {
    question: "Is Kids church at every branch?",
    confirm: "Whether Kids church runs at every branch, and any differences between branches.",
    link: { href: "/locations", label: "Find a Branch" },
  },
  {
    question: "Can teenagers bring a friend?",
    note: "Yes. A friend is welcome.",
    confirm: "How a friend's check-in works.",
  },
  {
    question: "Do we need to register before we come?",
    confirm: "Whether families need to sign up before a first Sunday, and how.",
  },
  {
    question: "What should my child bring?",
    confirm: "What, if anything, a child should bring.",
  },
  {
    question: "What if we arrive after the service has started?",
    confirm: "What families do if they arrive late.",
  },
  {
    question: "What if my child has allergies or additional needs?",
    confirm: "How allergies and additional needs are shared and supported.",
  },
  {
    question: "How long are the children out of the main service?",
    confirm: "How long each group is out, and whether they rejoin the service.",
  },
  {
    question: "Can brothers and sisters stay together?",
    confirm: "Whether siblings can stay in the same group.",
  },
  {
    question: "What about children younger than 3, or older than 16?",
    confirm: "What is offered for children under 3 and for young people over 16.",
  },
  {
    question: "Is there a cost?",
    confirm: "Whether Kids church costs anything.",
  },
  {
    question: "Who do I speak to if I have a question?",
    confirm: "Who a parent contacts, and how.",
  },
];

function FaqItem({ item }: { item: (typeof QUESTIONS)[number] }) {
  return (
    <details className="kids-faq__item">
      <summary>{item.question}</summary>
      <div className="kids-faq__answer">
        {item.note ? <p>{item.note}</p> : null}
        <ConfirmBadge what={item.confirm} />
        {item.link ? (
          <Link href={item.link.href} className="kids-faq__link">
            {item.link.label}
          </Link>
        ) : null}
      </div>
    </details>
  );
}

/** First half stays on the page. The rest unfolds from the button. */
const FIRST_BATCH = Math.ceil(QUESTIONS.length / 2);

export function ChildrenFaq() {
  const first = QUESTIONS.slice(0, FIRST_BATCH);
  const rest = QUESTIONS.slice(FIRST_BATCH);

  return (
    <section className="kids-section kids-wrap" aria-labelledby="kids-faq-title">
      <h2 id="kids-faq-title">Questions parents ask</h2>
      <div className="kids-faq">
        {first.map((item) => (
          <FaqItem key={item.question} item={item} />
        ))}
      </div>
      {rest.length > 0 ? (
        <details className="kids-faq__more">
          <summary>
            <span className="kids-faq__more-show">More questions</span>
            <span className="kids-faq__more-hide">Fewer questions</span>
          </summary>
          <div className="kids-faq">
            {rest.map((item) => (
              <FaqItem key={item.question} item={item} />
            ))}
          </div>
        </details>
      ) : null}
    </section>
  );
}
