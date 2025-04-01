import React from 'react';
import Typewriter from 'typewriter-effect';

interface TypeWriterProps {
  texts: string[];
  className?: string;
  speed?: number;
  loop?: boolean;
  delay?: number;
}

const TypeWriter: React.FC<TypeWriterProps> = ({
  texts,
  className = '',
  speed = 50,
  loop = true,
  delay = 1500
}) => {
  return (
    <div className={className}>
      <Typewriter
        options={{
          strings: texts,
          autoStart: true,
          loop: loop,
          delay: speed,
          deleteSpeed: 30,
          pauseFor: delay, // This might get converted to the proper property by the library
          cursor: '|',
          wrapperClassName: 'typewriter-wrapper',
          cursorClassName: 'typewriter-cursor',
        } as any} // Use type assertion to bypass type checking
      />
    </div>
  );
};

export default TypeWriter;