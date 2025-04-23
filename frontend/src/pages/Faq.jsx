import React from "react";
import "./css/Faq.css";

const Faq = () => {
  const faqSections = [
    {
      title: "👤 Account & Profile",
      questions: [
        "How do I create an account?",
        "How can I reset my password?",
        "How do I delete my account?",
      ],
    },
    {
      title: "🔐 Privacy & Security",
      questions: [
        "Who can see my profile?",
        "How do I block or report someone?",
        "Is my data safe?",
      ],
    },
    {
      title: "🧭 Using Facely",
      questions: [
        "How do I post a photo or status?",
        "How can I like, comment, or share posts?",
        "How do I find or follow friends?",
      ],
    },
    {
      title: "🛠️ Customization & Settings",
      questions: [
        "How do I change my profile picture?",
        "How do I change notification settings?",
        "Can I make my profile private?",
      ],
    },
    {
      title: "🆘 Support & Troubleshooting",
      questions: [
        "The app is not loading — what do I do?",
        "How do I report a bug?",
        "How can I contact support?",
      ],
    },
  ];

  return (
    <div className="faq-container">
      <div className="faq-box">
        <h2>Frequently Asked Questions</h2>
        {faqSections.map((section, index) => (
          <section key={index}>
            <h3>{section.title}</h3>
            <ul>
              {section.questions.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Faq;
