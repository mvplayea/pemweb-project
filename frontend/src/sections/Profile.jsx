import ScrollReveal from "../components/ScrollReveal";
import BlurText from "../components/BlurText";
import Threads from "../components/Threads";
import LightRays from "../components/LightRays";
import StarBorder from "../components/StarBorder";
import { Link } from "react-router";
import { motion } from "framer-motion";
import styled from "styled-components"
import FadeContent from "../components/FadeContent";
import DarkVeil from "../components/DarkVeil";
import ProfileCard from "../components/ProfileCard";
import TiltedCard from "../components/TiltedCard";

import profile from "../assets/Profile.jpg";

const ProfileSection = styled.div`
  width: 100%;
height: 100%;
min-height: 100vh;
  overflow-x: hidden;
background: #000;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
`;

const NameSection = styled.section`
  width: 100%;
  display: flex;
  height: 100%;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const ImageSection = styled.div`
  width: 100%;
  display: flex;
  height: 100%;m
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  position: absolute;
`


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
            raysColor="#00FFFF"
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
        <ImageSection>
          <FadeContent
            blur={true}
            duration={1000}
            easing="ease-out"
            initialOpacity={0}
            delay={700}
          >
            <TiltedCard
              imageSrc={profile}
              altText="Profile of Firschanya Alula Rietmadhanty"
              captionText="Firschanya Alula Rietmadhantyj"
              containerHeight="300px"
              containerWidth="300px"
              imageHeight="300px"
              imageWidth="300px"
              rotateAmplitude={12}
              scaleOnHover={1.2}
              showMobileWarning={false}
              showTooltip={true}
              displayOverlayContent={true}
              overlayContent={
                <p className="tilted-card-demo-text">
                  I'm Firschanya Alula Rietmadhanty
                </p>
              }
            />
          </FadeContent>
        </ImageSection>
        <NameText>
          <BlurText
            text="Firschanya Alula Rietmadhanty :D"
            animateBy="words"
            direction="top"
            delay={300}
          />
        </NameText>
      </NameSection>

      {/* <FadeContent */}
      {/*   blur={true} duration={1000} easing="ease-out" initialOpacity={0} */}
      {/* > */}
      {/*   <motion.div */}
      {/*     initial={{ y: -400 }} */}
      {/*     animate={{ y: 0 }} */}
      {/*     transition={{ duration: 1, ease: "easeOut" }} */}
      {/*   > */}
      {/*     <ImageSection> */}
      {/*       <img src={profile} width={500} /> */}
      {/*     </ImageSection> */}
      {/*   </motion.div> */}
      {/* </FadeContent> */}


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
            Contact the owner
          </StarBorder>
        </Link>
        <Link to="gallery">
          <StarBorder
            as="button"
            color="cyan"
            speed="5s"
            thickness={1}
          >
            Explore the creations
          </StarBorder>
        </Link>
      </ButtonContainer>
    </ProfileSection >
  );
}

export default Profile;
