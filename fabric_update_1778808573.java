```java
package com.example.swarmapp;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.List;

public class ChatFragment extends Fragment {

    private RecyclerView recyclerView;
    private ChatAdapter adapter;
    private List<ChatMessage> messages = new ArrayList<>();

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_chat, container, fal[3D[K
false);

        recyclerView = (RecyclerView) view.findViewById(R.id.recycler_view)[37D[K
view.findViewById(R.id.recycler_view);
        recyclerView.setLayoutManager(new LinearLayoutManager(getActivity()[33D[K
LinearLayoutManager(getActivity()));

        adapter = new ChatAdapter(messages);
        recyclerView.setAdapter(adapter);

        return view;
    }

    public void addMessage(ChatMessage message) {
        messages.add(message);
        adapter.notifyDataSetChanged();
    }
}

class ChatMessage {
    String sender;
    String text;

    public ChatMessage(String sender, String text) {
        this.sender = sender;
        this.text = text;
    }
}

class ChatAdapter extends RecyclerView.Adapter<ChatAdapter.ViewHolder> {

    private List<ChatMessage> messages;

    public ChatAdapter(List<ChatMessage> messages) {
        this.messages = messages;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layo[55D[K
LayoutInflater.from(parent.getContext()).inflate(R.layout.chat_message_layoLayoutInflater.from(parent.getContext()).inflate(R.layot.chat_message_layout, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        ChatMessage message = messages.get(position);
        holder.senderTextView.setText(message.sender);
        holder.messageTextView.setText(message.text);
    }

    @Override
    public int getItemCount() {
        return messages.size();
    }

    class ViewHolder extends RecyclerView.ViewHolder {

        public TextView senderTextView;
        public TextView messageTextView;

        public ViewHolder(View itemView) {
            super(itemView);
            senderTextView = (TextView) itemView.findViewById(R.id.sender_t[35D[K
itemView.findViewById(R.id.sender_text_view);
            messageTextView = (TextView) itemView.findViewById(R.id.message[34D[K
itemView.findViewById(R.id.message_text_view);
        }
    }
}
```

