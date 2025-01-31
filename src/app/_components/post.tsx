"use client";

import { useState } from "react";

import { api } from "@gitfleet/trpc/react";

function PostDisplay(props: {
  latestPostName: string | null | undefined;
  isPending: boolean;
  pendingName: string | undefined;
}) {
  if (props.isPending) {
    return (
      <p className="truncate">your most recent post: {props.pendingName}</p>
    );
  }

  if (props.latestPostName) {
    return (
      <p className="truncate">your most recent post: {props.latestPostName}</p>
    );
  }

  return <p>you have no posts yet.</p>;
}

export function LatestPost() {
  const [latestPost] = api.post.getLatest.useSuspenseQuery();

  const utils = api.useUtils();
  const [name, setName] = useState("");
  const createPost = api.post.create.useMutation({
    onMutate: async (newPost) => {
      await utils.post.getLatest.cancel();
      const previousPost = utils.post.getLatest.getData();
      // @ts-expect-error newPost is missing some feilds only in the DB
      utils.post.getLatest.setData(undefined, () => newPost);
      return { previousPost };
    },
    onError: (err, newPost, context) => {
      utils.post.getLatest.setData(undefined, context?.previousPost);
    },
    onSuccess: () => {
      setName("");
    },
    onSettled: async () => {
      await utils.post.invalidate();
    },
  });

  return (
    <div className="w-full max-w-xs">
      <PostDisplay
        latestPostName={latestPost?.name}
        isPending={createPost.isPending}
        pendingName={createPost.variables?.name}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPost.mutate({ name });
        }}
        className="flex flex-col gap-2"
      >
        <label htmlFor="post-input" className="sr-only">
          Post Title
        </label>
        <input
          type="text"
          placeholder="Title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        {createPost.error ? (
          <p className="text-red-500">{createPost.error.message}</p>
        ) : null}
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createPost.isPending}
        >
          {createPost.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
