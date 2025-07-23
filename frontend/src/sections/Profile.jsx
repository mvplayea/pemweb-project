import ScrollReveal from "../components/ScrollReveal";
import BlurText from "../components/BlurText";
import Threads from "../components/Threads";
import LightRays from "../components/LightRays";
import StarBorder from "../components/StarBorder";
import { Link } from "react-router";

import styled from "styled-components"

const ProfileSection = styled.div`
  width: 100%;
  height: 200vh; /* Two screenfuls of content */
  overflow-x: hidden;
  background-color: #000; /* Assuming dark background */
`;

const NameSection = styled.section`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const ThreadsWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const NameText = styled.div`
  z-index: 1;
  font-size: 4rem;
  letter-spacing: 0.1rem; 
  font-weight: bold;
  color: white;
`;

const ScrollSection = styled.section`
  width: 100%;
  min-height: 100vh;
  padding: 4rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
`

const Profile = () => {
  return (
    <ProfileSection>
      <NameSection>
        <ThreadsWrapper>
          {/* <Threads amplitude={1} distance={0} enableMouseInteraction={true} /> */}
          <LightRays
            raysOrigin="top-center"
            raysColor="#00ffff"
            raysSpeed={1.5}
            lightSpread={0.8}
            rayLength={1.2}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0.1}
            distortion={0.05}
            className="custom-rays"
          />
        </ThreadsWrapper>
        <NameText>
          <BlurText
            text="Firschanya Alula Rietmadhaty"
            animateBy="words"
            direction="top"
            delay={1000}
          />
        </NameText>
      </NameSection>

      <ScrollSection>
        <ScrollReveal
          baseOpacity={0}
          enableBlur={true}
          baseRotation={5}
          blurStrength={10}
        >
          I have honed my artistic abilities over the years, specializing in illustration, and I bring a vivid imagination to every project I work on. My dedication to mastering new skills, both in technology and the arts, fuels my creative process, and I am always eager to take on new challenges that push the boundaries of both fields.
        </ScrollReveal>
      </ScrollSection>

      <ButtonContainer>
        <Link to="order">
          <StarBorder
            as="button"
            color="cyan"
            speed="5s"
            thickness={1}
          >
            Contact me
          </StarBorder>
        </Link>
        <Link to="gallery">
          <StarBorder
            as="button"
            color="cyan"
            speed="5s"
            thickness={1}
          >
            Explore my work
          </StarBorder>
        </Link>
      </ButtonContainer>
    </ProfileSection>
  );
}

export default Profile;
