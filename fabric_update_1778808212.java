```java
public class VideoViewHolder extends RecyclerView.ViewHolder {
    public VideoPlayer videoPlayer;
    public ImageView thumbnail;

    public VideoViewHolder(View itemView) {
        super(itemView);
        videoPlayer = (VideoPlayer) itemView.findViewById(R.id.video_player[39D[K
itemView.findViewById(R.id.video_player);
        thumbnail = (ImageView) itemView.findViewById(R.id.thumbnail);
    }

    public void bind(VideoItem item) {
        if (item.getThumbnail() != null) {
            Glide.with(itemView.getContext()).load(item.getThumbnail()).int[63D[K
Glide.with(itemView.getContext()).load(item.getThumbnail()).into(thumbnail)Glide.with(itemView.getContext()).load(item.getThumbnail()).int(thumbnail);
        } else {
            thumbnail.setImageResource(R.drawable.default_thumbnail);
        }
        videoPlayer.setVideoPath(item.getPath());
        videoPlayer.start();
    }

    public void unbind() {
        thumbnail.setImageBitmap(null);
        videoPlayer.stopPlayback();
    }
}
```

