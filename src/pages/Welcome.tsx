import { WelcomeActionScreen } from "@/components/WelcomeActionScreen";
import { SEO } from "@/components/SEO";

const Welcome = () => {
  return (
    <>
      <SEO 
        title="Welcome to Phototheology"
        description="Choose your path: Study the Bible, explore the Memory Palace, ask Jeeves, take courses, and more."
      />
      <WelcomeActionScreen />
    </>
  );
};

export default Welcome;
