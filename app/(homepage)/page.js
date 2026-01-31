"use client"

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/core/store/hooks";
import HomepagePeserta from "@/views/homepage/HomepagePeserta";
import Link from "next/link";
import HomePagePenpos from "@/views/homepage/HomepagePenpos";
import HomePageAdmin from "@/views/homepage/HomePageAdmin";

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useAppSelector((state) => state.token.token);
  const role = useAppSelector((state) => state.role.role);

  useEffect(() => {
    if (token && role) {
      const fromPath = searchParams.get('from');
      if (fromPath && fromPath.startsWith('/')) {
        router.replace(fromPath);
      }
    }
  }, [token, role, searchParams, router]);

  return (
    <>
      <HomepagePeserta />
    </>
  );
}
