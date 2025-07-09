import * as React from 'react';

declare namespace MyLib {
  interface FancyProps {
    age: number;
    children?: React.ReactNode;
  }
}