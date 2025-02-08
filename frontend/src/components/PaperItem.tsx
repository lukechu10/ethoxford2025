import { A } from "@solidjs/router";
import type { Paper } from "../provider";

const PaperItem = ({ paper }: { paper: Paper }) => {
	return (
		<A
			href={`/paper/${paper.id}`}
			class="flex flex-row bg-gray-900 my-4 p-4 rounded-xl transition hover:-translate-y-1 hover:bg-linear-to-br hover:from-orange-700 hover:to-orange-800 group"
		>
			<div class="w-10 py-1.5 mr-5 flex flex-col justify-center font-bold">
				<div class="group-hover:bg-orange-500 transition-colors flex flex-col rounded">
					<i class="mx-auto bi bi-chevron-double-up"></i>
					<span class="mx-auto">{paper.votes}</span>
				</div>
			</div>
			<div>
				<div class="text-2xl font-bold">{paper.title}</div>
				<p class="text-sm text-primary-content">
					<span>{paper.timestamp.toDateString()}</span>
					<span class="ml-10">
						Author:
						<span class="font-bold text-orange-200">
							{paper.author.substring(0, 10)}...
						</span>
					</span>
				</p>

				<p class="mt-4">TODO: Abstract</p>
			</div>
		</A>
	);
};

export default PaperItem;
