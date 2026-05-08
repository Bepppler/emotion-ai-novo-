/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import EmotionScanner from "./components/EmotionScanner";

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] selection:bg-cyan-500 selection:text-black">
      <EmotionScanner />
    </div>
  );
}


