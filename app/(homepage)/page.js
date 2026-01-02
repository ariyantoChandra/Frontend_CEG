"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/core/store/hooks";
import HomepagePeserta from "@/views/homepage/HomepagePeserta";
import Link from "next/link";
import HomePagePenpos from "@/views/homepage/HomepagePenpos";
import HomePageAdmin from "@/views/homepage/HomePageAdmin";

export default function HomePage() {
  return (
    <>
      <HomepagePeserta />
    </>
  );
}
