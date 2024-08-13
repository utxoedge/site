<script lang="ts">
  type Props = { date: Date; time?: boolean };

  let { date, time }: Props = $props();
</script>

<span class="font-semibold">{date.toLocaleDateString()}</span>
{#if time}
  -
  <span class="text-xs">{date.toLocaleTimeString()}</span>
{/if}
