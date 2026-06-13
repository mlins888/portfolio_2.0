import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Contact() {
  return (
    <div className="contact">
      <h1>Get in touch</h1>
      <p>I&apos;d love to hear about new projects and collaborations!</p>
      <a href="mailto:Makenna@Linsky.net">Makenna@Linsky.net</a>
      <a href="mailto:Makenna.Linsky@duke.edu">Makenna.Linsky@duke.edu</a>

      <div className="socials">
        <a href="https://github.com/mlins888" aria-label="GitHub" target="_blank" rel="noreferrer">
          <FaGithub />
        </a>
        <a href="https://www.linkedin.com/in/makenna-linsky/" aria-label="LinkedIn" target="_blank" rel="noreferrer">
          <FaLinkedin />
        </a>
      </div>
    </div>
  );
}