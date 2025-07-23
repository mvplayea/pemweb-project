import React, { useState } from "react";
import Gallery3DViewer from "./3d/Gallery3DViewer"
import GalleryViewer from "./2d/GalleryViewer"
import BlurText from "./components/BlurText"
import Threads from "./components/Threads"
import StarBorder from "./components/StarBorder"

import Profile from "./sections/Profile"
import styled from "styled-components"

const Opener = styled.div`
  color: #fff;
`
export default function App() {
  const [showOpener, setShowOpener] = useState(true);
  const [showGallery, setShowGallery] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  return (
    <>
      <div className="App">
        {showOpener ? (
          <Opener>
            <BlurText
              text="Welcome to the Gallery"
              animateBy="words"
              direction="top"
              onAnimationComplete={() => setShowOpener(false)}
              delay={200}
            />
          </Opener>
        ) : (
          <Profile />
        )}
      </div>
    </>
  )
}
