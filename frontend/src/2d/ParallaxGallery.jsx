import React from 'react';
import styled from 'styled-components';
import { Parallax } from 'react-scroll-parallax';

import profile from "../assets/Profile.jpg";

const GallerySection = styled.section`
  background-color: #000;
  padding: 10rem 3rem;
  color: white;
`;

const GalleryContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

// This wrapper will hold all the parallax elements and define the "viewport" for them.
const ParallaxWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 90vh; // Adjust height to control the space for the effect
`;

// A generic container for any element we want to apply parallax to
const ParallaxElement = styled.div`
  position: absolute;
`;

const ImageCard = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const SpeedTag = styled.span`
  position: absolute;
  top: 20px;
  left: -25px;
  background-color: #3b82f6; // Blue color
  color: white;
  padding: 5px 35px;
  font-size: 0.8rem;
  font-weight: 500;
  transform: rotate(-45deg);
`;

const CentralText = styled.h2`
  font-size: 6rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.15);
  text-align: center;
  width: 100%;
  letter-spacing: -2px;
`;

const DescriptionBlock = styled.div`
  margin-top: -5rem; // Pulls the text up to overlap with the gallery
  max-width: 400px;

  p {
    font-size: 1rem;
    color: #a1a1aa;
    line-height: 1.8;
  }
`;

// --- The Parallax Gallery Component ---

const ParallaxGallery = () => {
  return (
    <GallerySection>
      <GalleryContainer>
        <ParallaxWrapper>
          {/* Central Text with its own parallax effect */}
          <ParallaxElement style={{ top: '30%', width: '100%', zIndex: 10 }}>
            <Parallax speed={-5}>
              <CentralText>
                ...here are many more<br />techniques...
              </CentralText>
            </Parallax>
          </ParallaxElement>

          {/* Image 1 (Top Left) */}
          <ParallaxElement style={{ top: '0', left: '5%', width: '35%', zIndex: 5 }}>
            <Parallax speed={-15}>
              <ImageCard>
                <SpeedTag style={{ transform: 'rotate(0)', left: '20px' }}>slow</SpeedTag>
                <img src={profile} alt="Cyberpunk city" />
              </ImageCard>
            </Parallax>
          </ParallaxElement>

          {/* Image 2 (Top Right) */}
          <ParallaxElement style={{ top: '10%', right: '5%', width: '45%', zIndex: 1 }}>
            <Parallax speed={10}>
              <ImageCard>
                <SpeedTag style={{ transform: 'rotate(0)', left: '20px' }}>fast</SpeedTag>
                <img src={profile} alt="Neon street" />
              </ImageCard>
            </Parallax>
          </ParallaxElement>

          {/* Image 3 (Middle Right) */}
          <ParallaxElement style={{ bottom: '25%', right: '15%', width: '20%', zIndex: 12 }}>
            <Parallax speed={25}>
              <ImageCard>
                <SpeedTag style={{ transform: 'rotate(0)', left: '20px' }}>speedy</SpeedTag>
                <img src="https://images.unsplash.com/photo-1570191973631-98b06387584e?w=800" alt="Rainy alley" />
              </ImageCard>
            </Parallax>
          </ParallaxElement>

          {/* Image 4 (Bottom) */}
          <ParallaxElement style={{ bottom: '0', left: '45%', width: '30%', zIndex: 11 }}>
            <Parallax speed={-5}>
              <ImageCard>
                <img src="https://images.unsplash.com/photo-1561575063-e0283c271542?w=800" alt="City lights" />
              </ImageCard>
            </Parallax>
          </ParallaxElement>

        </ParallaxWrapper>

        <DescriptionBlock>
          <p>
            Parallax scrolling a trending web design technique to add depth and visual interest to the design. It creates a dynamic experience that keeps users engaged.
          </p>
        </DescriptionBlock>
      </GalleryContainer>
    </GallerySection>
  );
};

export default ParallaxGallery;
