import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';
import { ParallaxProvider } from 'react-scroll-parallax';
import Threads from "../components/Threads";
import ParallaxGallery from '../2d/ParallaxGallery';


// This main wrapper creates the smooth background transition effect
const AppWrapper = styled.div`
  background: linear-gradient(180deg, #100623 30%, #000000 80%);
  color: white;
`;


// --- Hero Section (First Screen) ---

const HeroSection = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2.5rem 3rem;
`;

const HeaderNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  cursor: pointer;
`;

const NavMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const LanguageSelector = styled.div`
  font-size: 1rem;
  cursor: pointer;
  span {
    margin-left: 0.3rem;
  }
`;

const HamburgerMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;

  div {
    width: 28px;
    height: 3px;
    background-color: white;
  }
`;

const HeroMainContent = styled.main`
  max-width: 600px;
`;

const HeadlineWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const Line = styled.div`
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #A855F7, #D946EF);
`;

const Headline = styled.h2`
  font-size: 2.5rem;
  font-weight: 300;
  letter-spacing: 2px;
  margin: 0;
  text-transform: uppercase;
`;

const SubHeadline = styled.h1`
  font-size: 6rem;
  font-weight: 800;
  margin: -1rem 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const HeroDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 450px;
  color: #d1d5db;
`;

const FooterBar = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CallToAction = styled.a`
  font-size: 1.2rem;
  font-weight: 500;
  color: white;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const SearchIcon = styled.div`
  font-size: 1.5rem;
  cursor: pointer;
`;


// --- "What I do" Section (Second Screen) ---

const WhatIDoSection = styled.section`
  padding: 8rem 3rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div``;
const RightColumn = styled.div`
    margin-top: 3rem;
`;

const SectionTitle = styled.h2`
    font-size: 4rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
`;

const TitleUnderline = styled.div`
  width: 90px;
  height: 4px;
  background: linear-gradient(90deg, #A855F7, #D946EF);
  margin-bottom: 2.5rem;
`;

const SectionDescription = styled.p`
  font-size: 1.75rem;
  line-height: 1.6;
  max-width: 500px;
  margin-bottom: 5rem;
`;

const CardSubheading = styled.h3`
  font-size: 0.9rem;
  text-transform: uppercase;
  color: #888;
  letter-spacing: 1.5px;
  margin-bottom: 1rem;
`;

const CodeCard = styled.div`
  background-color: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 1.5rem;
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 0.85rem;
  line-height: 1.7;
  white-space: pre-wrap;

  span.comment { color: #6a9955; }
  span.keyword { color: #569cd6; }
  span.interface { color: #4ec9b0; }
  span.string { color: #ce9178; }
  span.bracket { color: #ffd700; }
  span.prop { color: #9cdcfe; }
`;

const ImageCard = styled.div`
  background-color: #222; /* Placeholder for the actual image */
  background-image: url('https://i.imgur.com/kS5B34v.jpeg'); /* Using a placeholder image */
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  width: 100%;
  aspect-ratio: 4 / 5;
  border: 1px solid #333;
`;

const ThreadsWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

// --- The Main App Component ---
function App() {
  const codeSnippet = `
<span class="keyword">import</span> { FC } <span class="keyword">from</span> <span class="string">'react'</span>
<span class="keyword">import</span> { <span class="bracket">{</span> createBrowserRouter, RouterProvider <span class="bracket">}</span> } <span class="keyword">from</span> <span class="string">'react-router-dom'</span>
<span class="keyword">import</span> { route } <span class="keyword">from</span> <span class="string">'./routes/routes'</span>

<span class="interface">Interface</span> Props {
  <span class="prop">theme</span>: "dark" | "light"
}

<span class="keyword">const</span> router = createBrowserRouter(routes, {});
<span class="keyword">const</span> App: <span class="interface">FC</span><Props> = (<span class="bracket">{</span> theme <span class="bracket">}</span>) => {

  <span class="keyword">return</span> (
    <span class="comment">// Some code here...</span>
  )
}
  `;

  return (
    <>
      <ParallaxProvider>
        <AppWrapper>
          {/* --- Screen 1: Hero --- */}
          <ThreadsWrapper>
            <Threads amplitude={1} distance={0} enableMouseInteraction={true} />
          </ThreadsWrapper>
          <HeroSection>
            <HeaderNav>
              <Logo>Alle</Logo>
            </HeaderNav>

            <HeroMainContent>
              <HeadlineWrapper>
                <Headline>Make It</Headline>
                <Line />
              </HeadlineWrapper>
              <SubHeadline>Innovative</SubHeadline>
              <HeroDescription>
                I'm Alle, a web developer and designer who build modern, visually
                appealing and clean websites.
              </HeroDescription>
              <Link to="/order">
                <div>Contact Me</div>
              </Link>
            </HeroMainContent>

            <FooterBar>
              <CallToAction>Let's Talk</CallToAction>
              <SearchIcon>&#x1F50D;</SearchIcon>
            </FooterBar>
          </HeroSection>

          {/* --- Screen 2: What I do --- */}
          <WhatIDoSection>
            <LeftColumn>
              <SectionTitle>What i do</SectionTitle>
              <TitleUnderline />
              <SectionDescription>
                I creates memorable websites with smooth animations and interactive experiences.
              </SectionDescription>

              <CardSubheading>3D Card Hover Effect</CardSubheading>
              <CodeCard dangerouslySetInnerHTML={{ __html: codeSnippet }} />
            </LeftColumn>

            <RightColumn>
              <CardSubheading>Image Hover Parallax</CardSubheading>
              <ImageCard />
            </RightColumn>
          </WhatIDoSection>
          <ParallaxGallery />
        </AppWrapper>
      </ParallaxProvider>
    </>
  );
}

export default App;
