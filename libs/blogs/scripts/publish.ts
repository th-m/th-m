import { buildBlogArtifact } from "../src/publish";

const manifest = await buildBlogArtifact();
console.log(`Published ${manifest.posts.length} article${manifest.posts.length === 1 ? "" : "s"} to libs/blogs/dist.`);
