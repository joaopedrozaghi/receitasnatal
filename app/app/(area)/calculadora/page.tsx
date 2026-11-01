import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/app/PageHeader";
import { PriceCalculator } from "@/components/app/Tools";

export const metadata: Metadata = { title: "Calculadora de preço" };

export default function CalculatorPage() {
  return (
    <>
      <PageHeader
        back="/app/mais"
        title="Calculadora de preço"
        subtitle="Some todos os custos, divida pelo rendimento e aplique a sua margem."
      />
      <Container className="py-6">
        <PriceCalculator />
      </Container>
    </>
  );
}
