<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar';
  import type { HTMLImgAttributes } from 'svelte/elements';

  let {
    src,
    alt,
    fallback,
  }: {
    src: HTMLImgAttributes['src'];
    alt: HTMLImgAttributes['alt'];
    fallback: string;
  } = $props();
</script>

<Avatar.Root>
  <Avatar.Image {src} {alt} />
  <Avatar.Fallback>{fallback}</Avatar.Fallback>
</Avatar.Root>
