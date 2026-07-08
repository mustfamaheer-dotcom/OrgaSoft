import React from 'react';

interface Props {
  value: string;
  duration?: number;
}

const AnimatedCounter: React.FC<Props> = ({ value }) => {
  return <span>{value}</span>;
};

export default AnimatedCounter;
