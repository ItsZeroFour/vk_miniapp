import { useState, useRef, useEffect, useMemo } from "react";
import { OBJECTS } from "../data/contact-dots";
import { getRandomObject, clampLocalWithCTM } from "../utils/geometry";
import { MIN_SNAP, MAX_SNAP, HANDLE_R } from "../utils/constants";

export function useContactDotsGame() {
  const [current, setCurrent] = useState(getRandomObject());
  const [contactPoints, setContactPoints] = useState([]);
  const [locks, setLocks] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [showFill, setShowFill] = useState(false);
  const [zoomed, setZoomed] = useState(true);
  const [progress, setProgress] = useState(1);

  const svgRef = useRef(null);
  const gRef = useRef(null);
  const draggingIdxRef = useRef(-1);
  const isDraggingRef = useRef(false);

  // TODO: добавь initializePoints, handlePointerDown/Move/Up и логику снапа

  return {
    current,
    contactPoints,
    locks,
    completed,
    showFill,
    zoomed,
    progress,
    svgRef,
    gRef,
    onPointerDown: () => {},
    handleNext: () => {},
  };
}
