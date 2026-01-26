import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import FadeIn from "./FadeIn";

function Faq() {

    return (
        <div className="flex flex-col items-center justify-center w-full z-[5] py-10 lg:py-20">
            <FadeIn direction="up" delay={0.3} fullWidth>
                <h2 className="md:text-5xl text-3xl text-white font-semibold text-center py-3 z-5">
                    Frequently Asked Questions
                </h2>
            </FadeIn>

            <FadeIn direction="up" delay={0.4} fullWidth>
                <img
                    className="relative py-10"
                    src="https://res.cloudinary.com/djoebsejh/image/upload/v1721134750/q18zkrflfd1rca0loy2f.svg"
                    alt="FAQ Decoration"
                />
            </FadeIn>

            <FadeIn direction="up" delay={0.5} fullWidth>
                <div className="w-full max-w-4xl p-4 z-[5]">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1" className="border-b border-gray-400">
                            <AccordionTrigger className="text-lg md:text-xl py-4 px-6 text-white">
                                How does the funding process work?
                            </AccordionTrigger>
                            <AccordionContent className="text-base p-6 text-white">
                                Once you post your project, investors can browse and choose to fund your idea.
                                The investments are handled via smart contracts to ensure transparency and security.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2" className="border-b border-gray-400">
                            <AccordionTrigger className="text-lg md:text-xl py-4 px-6 text-white">
                                What are the benefits of using blockchain for funding?
                            </AccordionTrigger>
                            <AccordionContent className="text-base p-6 text-white">
                                Blockchain ensures that all transactions are transparent, immutable, and secure.
                                Investors can track how funds are used, and startups can build trust with their
                                backers.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3" className="border-b border-gray-400">
                            <AccordionTrigger className="text-lg md:text-xl py-4 px-6 text-white">
                                How can I post a project?
                            </AccordionTrigger>
                            <AccordionContent className="text-base p-6 text-white">
                                To post a project, simply sign up, complete your profile, and fill out the
                                'Post Project' form with all necessary details including title, description,
                                amount needed, and milestones.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4" className="border-b border-gray-400">
                            <AccordionTrigger className="text-lg md:text-xl py-4 px-6 text-white">
                                What happens if my project does not reach its funding goal?
                            </AccordionTrigger>
                            <AccordionContent className="text-base p-6 text-white">
                                If your project does not reach its funding goal, investors can choose to withdraw
                                their funds. The smart contract ensures that all transactions are fair and
                                transparent.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-5" className="border-b border-gray-400">
                            <AccordionTrigger className="text-lg md:text-xl py-4 px-6 text-white">
                                How do I know my investment is secure?
                            </AccordionTrigger>
                            <AccordionContent className="text-base p-6 text-white">
                                All investments are managed through secure smart contracts on the blockchain.
                                You can track the usage of your funds and withdraw your investment if the project
                                is not progressing as expected.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-6">
                            <AccordionTrigger className="text-lg md:text-xl py-4 px-6 border-0 text-white hover:no-underline">
                                What fees are involved in the platform?
                            </AccordionTrigger>
                            <AccordionContent className="text-base p-6 text-white border-none">
                                Our platform charges a small fee on successful funding transactions to cover
                                operational costs. Details on the fee structure can be found in the 'Pricing'
                                section of our website.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </FadeIn>

        </div>
    );
}

export default Faq;
