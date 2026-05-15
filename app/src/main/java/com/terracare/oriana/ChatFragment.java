Here is the raw Java code for `ChatFragment.java`:
```java
package com.example.messenger;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.TextView;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import org.json.JSONObject;

public class ChatFragment extends Fragment {

    private static final String TAG = "ChatFragment";
    private RecyclerView mRecyclerView;
    private EditText mEditText;
    private TextView mTextView;
    private ChatAdapter mAdapter;
    private MessengerClient mClient;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, [K
Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_chat, container, false);
    }

    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        mRecyclerView = view.findViewById(R.id.recycler_view);
        mEditText = view.findViewById(R.id.edit_text);
        mTextView = view.findViewById(R.id.text_view);

        mAdapter = new ChatAdapter();
        mRecyclerView.setLayoutManager(new LinearLayoutManager(getContext()[32D[K
LinearLayoutManager(getContext()));
        mRecyclerView.setAdapter(mAdapter);

        mClient = MessengerClient.getInstance();

        mClient.getMessages(new MessengerClient.Callback() {
            @Override
            public void onMessagesReceived(JSONArray messages) {
                mAdapter.setMessages(messages);
                mRecyclerView.scrollToPosition(mAdapter.getItemCount() - 1)[2D[K
1);
            }
        });

        mEditText.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int co[2D[K
count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before[6D[K
before, int count) {}

            @Override
            public void afterTextChanged(Editable s) {
                if (s.length() > 0) {
                    mClient.sendMessage(s.toString());
                    mEditText.setText("");
                }
            }
        });
    }

    private class ChatAdapter extends RecyclerView.Adapter<ChatAdapter.View[37D[K
RecyclerView.Adapter<ChatAdapter.ViewHolder> {

        private JSONArray mMessages;

        public void setMessages(JSONArray messages) {
            mMessages = messages;
            notifyDataSetChanged();
        }

        @Override
        public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType[8D[K
viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.[51D[K
LayoutInflater.from(parent.getContext()).inflate(R.layout.chat_item, parent[6D[K
parent, false);
            return new ViewHolder(view);
        }

        @Override
        public void onBindViewHolder(ViewHolder holder, int position) {
            JSONObject message = mMessages.optJSONObject(position);
            holder.mTextView.setText(message.optString("text"));
            holder.mImageView.setImageResource(getDrawableId(message));
        }

        @Override
        public int getItemCount() {
            return mMessages.length();
        }

        private class ViewHolder extends RecyclerView.ViewHolder {

            public TextView mTextView;
            public ImageView mImageView;

            public ViewHolder(View itemView) {
                super(itemView);
                mTextView = itemView.findViewById(R.id.text_view);
                mImageView = itemView.findViewById(R.id.image_view);
            }
        }
    }
}
```
Note that this code assumes you have already implemented the `MessengerClie[14D[K
`MessengerClient` class and its associated methods, as well as the layout f[1D[K
files `fragment_chat.xml` and `chat_item.xml`.

