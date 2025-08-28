import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronDown, FaChevronUp, FaUser, FaHospital, FaQuestionCircle } from 'react-icons/fa';

const FAQItem = ({ question, answer, isOpen, onToggle }) => (
  <motion.div 
    className="faq-item"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <button 
      className="faq-question" 
      onClick={onToggle}
      aria-expanded={isOpen}
    >
      <span>{question}</span>
      {isOpen ? <FaChevronUp /> : <FaChevronDown />}
    </button>
    <motion.div 
      className="faq-answer"
      initial={false}
      animate={{ 
        height: isOpen ? 'auto' : 0,
        opacity: isOpen ? 1 : 0
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="faq-answer-content">
        {answer}
      </div>
    </motion.div>
  </motion.div>
);

const FAQPage = () => {
  const [openItems, setOpenItems] = useState(new Set([0, 1]));

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const patientFAQs = [
    {
      question: "How do I book an appointment?",
      answer: "Browse available clinics, select your preferred doctor and service, choose a date and time, and complete the booking form. You'll receive a confirmation immediately."
    },
    {
      question: "Can I cancel or reschedule my appointment?",
      answer: "Yes! Go to your dashboard, find the upcoming appointment, and use the 'Cancel' or 'Reschedule' buttons. You can modify appointments up to 24 hours before the scheduled time."
    },
    {
      question: "Do I need an account to book appointments?",
      answer: "Yes, you need to create a free account to book and manage appointments. This helps us keep track of your medical history and appointment preferences."
    },
    {
      question: "What if I need to see a specific specialist?",
      answer: "Use our Symptom Checker to get recommendations, or browse clinics by specialization. You can also filter doctors by their expertise when booking."
    },
    {
      question: "How do I leave a review for a clinic?",
      answer: "After completing an appointment, you'll see a 'Leave Review' option in your dashboard. You can rate the clinic and share your experience to help other patients."
    },
    {
      question: "Is my personal information secure?",
      answer: "Absolutely. We use industry-standard encryption and never share your personal or medical information with third parties. Your privacy is our top priority."
    }
  ];

  const clinicFAQs = [
    {
      question: "How do I register my clinic?",
      answer: "Click 'Join as Clinic' on the homepage, fill out the registration form with your clinic details and license number, and submit for admin approval. We'll review and approve within 24-48 hours."
    },
    {
      question: "How do I add doctors to my clinic?",
      answer: "Once approved, go to your Clinic Dashboard → Doctors section. Click 'Add Doctor' and fill in their details including name, specialization, bio, and photo."
    },
    {
      question: "How do I manage services and pricing?",
      answer: "In your Clinic Dashboard → Services section, you can add, edit, or remove services. Set the service name, price, duration, and description for each offering."
    },
    {
      question: "How do I update my clinic profile?",
      answer: "Visit Clinic Dashboard → Profile to update your clinic information, address, contact details, and upload new photos. Changes are saved immediately."
    },
    {
      question: "How do I manage appointment requests?",
      answer: "All appointment requests appear in your Clinic Dashboard → Appointments. You can view patient details, confirm appointments, and update their status as needed."
    },
    {
      question: "Can I set my own availability?",
      answer: "Yes! In your clinic profile, you can set opening hours for each day of the week. You can also specify individual doctor availability in the Doctors section."
    }
  ];

  const generalFAQs = [
    {
      question: "What makes CareySite different from other platforms?",
      answer: "CareySite offers a comprehensive healthcare booking experience with AI-powered symptom checking, detailed doctor profiles, transparent pricing, and seamless appointment management for both patients and clinics."
    },
    {
      question: "Is the platform available 24/7?",
      answer: "Yes! You can browse clinics, book appointments, and access your dashboard 24/7. However, clinic responses and confirmations may depend on their business hours."
    },
    {
      question: "What if I have technical issues?",
      answer: "Contact our support team through the Contact page. We typically respond within a few hours and are committed to resolving any issues quickly."
    },
    {
      question: "Can I use CareySite on mobile devices?",
      answer: "Absolutely! Our platform is fully responsive and works perfectly on all devices including smartphones, tablets, and desktop computers."
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Frequently Asked Questions</h1>
          <p>Everything you need to know about using CareySite for your healthcare needs</p>
        </motion.div>
      </div>

      <div className="faq-sections">
        {/* Patient FAQs */}
        <motion.section 
          className="faq-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="faq-section-header">
            <FaUser className="faq-section-icon" />
            <h2>For Patients</h2>
            <p>Common questions about booking appointments and using our platform</p>
          </div>
          <div className="faq-list">
            {patientFAQs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openItems.has(index)}
                onToggle={() => toggleItem(index)}
              />
            ))}
          </div>
        </motion.section>

        {/* Clinic FAQs */}
        <motion.section 
          className="faq-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="faq-section-header">
            <FaHospital className="faq-section-icon" />
            <h2>For Clinics</h2>
            <p>Information for healthcare providers joining our platform</p>
          </div>
          <div className="faq-list">
            {clinicFAQs.map((faq, index) => (
              <FAQItem
                key={index + 100}
                question={faq.question}
                answer={faq.answer}
                isOpen={openItems.has(index + 100)}
                onToggle={() => toggleItem(index + 100)}
              />
            ))}
          </div>
        </motion.section>

        {/* General FAQs */}
        <motion.section 
          className="faq-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="faq-section-header">
            <FaQuestionCircle className="faq-section-icon" />
            <h2>General Information</h2>
            <p>Platform features and general questions</p>
          </div>
          <div className="faq-list">
            {generalFAQs.map((faq, index) => (
              <FAQItem
                key={index + 200}
                question={faq.question}
                answer={faq.answer}
                isOpen={openItems.has(index + 200)}
                onToggle={() => toggleItem(index + 200)}
              />
            ))}
          </div>
        </motion.section>
      </div>

      <motion.div 
        className="faq-contact"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <h3>Still have questions?</h3>
        <p>Can't find what you're looking for? Our support team is here to help!</p>
        <a href="/contact" className="btn btn-primary">
          Contact Support
        </a>
      </motion.div>
    </div>
  );
};

export default FAQPage;