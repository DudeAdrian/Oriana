```java
package com.swarm.smarthome.feed;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.google.android.material.imageview.ShapeableImageView;

public class FeedAdapter extends RecyclerView.Adapter<FeedAdapter.ViewHolde[42D[K
RecyclerView.Adapter<FeedAdapter.ViewHolder> {

    private static final int VERTICAL_SCROLL = 0;

    public interface OnItemClickListener {
        void onItemClick(int position);
    }

    private Context context;
    private OnItemClickListener itemClickListener;

    public FeedAdapter(Context context, OnItemClickListener listener) {
        this.context = context;
        this.itemClickListener = listener;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        if (viewType == VERTICAL_SCROLL) {
            View view = LayoutInflater.from(context).inflate(R.layout.feed_[51D[K
LayoutInflater.from(context).inflate(R.layout.feed_item_vertical_scroll, pa[2D[K
parent, false);
            return new ViewHolder(view);
        }
        throw new RuntimeException("Unknown view type");
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        // Bind data to the viewholder
    }

    @Override
    public int getItemViewType(int position) {
        return VERTICAL_SCROLL;
    }

    @Override
    public int getItemCount() {
        // Return item count
    }

    public class ViewHolder extends RecyclerView.ViewHolder {

        private ShapeableImageView mProfilePic;
        private TextView mUsername;

        public ViewHolder(View itemView) {
            super(itemView);
            mProfilePic = itemView.findViewById(R.id.profile_pic);
            mUsername = itemView.findViewById(R.id.username);

            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (itemClickListener != null) {
                        itemClickListener.onItemClick(getAdapterPosition())[51D[K
itemClickListener.onItemClick(getAdapterPosition());
                    }
                }
            });
        }
    }
}

```

