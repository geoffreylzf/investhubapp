<template>
  <div>
    <div v-if="editor" class="menu">
      <a-button-group>
        <a-tooltip>
          <template #title>Bold</template>
          <a-button
            icon="bold"
            :class="{ 'is-active': editor.isActive('bold') }"
            @click="toggleBold()"
          />
        </a-tooltip>
        <a-tooltip>
          <template #title>Italic</template>
          <a-button
            icon="italic"
            :class="{ 'is-active': editor.isActive('italic') }"
            @click="toggleItalic()"
          />
        </a-tooltip>
        <a-tooltip>
          <template #title>Strike</template>
          <a-button
            icon="strikethrough"
            :class="{ 'is-active': editor.isActive('strike') }"
            @click="toggleStrike()"
          />
        </a-tooltip>
        <a-tooltip>
          <template #title>Code</template>
          <a-button
            icon="code"
            :class="{ 'is-active': editor.isActive('code') }"
            @click="toggleCode()"
          />
        </a-tooltip>
        <a-tooltip>
          <template #title>Clear Marks</template>
          <a-button icon="reload" @click="unsetAllMarks()" />
        </a-tooltip>
      </a-button-group>

      <a-button-group>
        <a-tooltip>
          <template #title>Bullet List</template>
          <a-button
            icon="unordered-list"
            :class="{ 'is-active': editor.isActive('bulletList') }"
            @click="toggleBulletList()"
          />
        </a-tooltip>
        <a-tooltip>
          <template #title>Number List</template>
          <a-button
            icon="ordered-list"
            :class="{ 'is-active': editor.isActive('orderedList') }"
            @click="toggleOrderedList()"
          />
        </a-tooltip>
      </a-button-group>

      <a-button-group>
        <a-tooltip>
          <template #title>Undo</template>
          <a-button icon="undo" @click="undo()" />
        </a-tooltip>
        <a-tooltip>
          <template #title>Redo</template>
          <a-button icon="redo" @click="redo()" />
        </a-tooltip>
      </a-button-group>

      <a-button
        v-if="!isBasic"
        icon="picture"
        @click="$refs.imgInput.click()"
      />
      <input
        ref="imgInput"
        type="file"
        style="display: none"
        accept="image/png, image/jpeg"
        enctype="multipart/form-data"
        @change="handleUpload"
      />

      <div v-if="!isBasic" class="mb-8" />
      <a-button-group v-if="!isBasic" class="heading">
        <a-button
          v-for="idx in 3"
          :key="idx"
          :class="{ 'is-active': editor.isActive('heading', { level: idx }) }"
          @click="toogleHeading(idx)"
        >
          H{{ idx }}
        </a-button>
      </a-button-group>
      <a-button-group>
        <a-button size="small" @click="setHardBreak()">Breakline</a-button>
        <a-button
          v-if="!isBasic"
          size="small"
          :class="{ 'is-active': editor.isActive('blockquote') }"
          @click="toggleBlockquote()"
        >
          Blockquote
        </a-button>
        <a-button v-if="!isBasic" size="small" @click="setHorizontalRule()">
          Divider
        </a-button>
      </a-button-group>

      <a-button-group>
        <a-button
          size="small"
          :class="{ 'is-active': editor.isActive('link') }"
          @click="setLink()"
          >Set URL</a-button
        >
        <a-button
          size="small"
          :disabled="!editor.isActive('link')"
          @click="editor.chain().focus().unsetLink().run()"
        >
          Unset URL
        </a-button>
      </a-button-group>
    </div>
    <EditorContent :editor="editor" class="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import { Image } from '@tiptap/extension-image'
import { Link } from '@tiptap/extension-link'

export default {
  components: {
    EditorContent,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    imgUploadUrl: {
      type: String,
      default: '',
    },
    isBasic: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editor: null,
    }
  },
  watch: {
    value(value) {
      const isSame = this.editor.getHTML() === value

      if (isSame) {
        return
      }

      this.editor.commands.setContent(value, false)
    },
  },
  mounted() {
    this.editor = new Editor({
      content: this.value,
      extensions: [StarterKit, Image, Link],
      onUpdate: () => {
        this.$emit('input', this.editor.getHTML())
      },
    })
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  methods: {
    toggleBold() {
      this.editor.chain().focus().toggleBold().run()
    },
    toggleItalic() {
      this.editor.chain().focus().toggleItalic().run()
    },
    toggleStrike() {
      this.editor.chain().focus().toggleStrike().run()
    },
    toggleCode() {
      this.editor.chain().focus().toggleCode().run()
    },
    unsetAllMarks() {
      this.editor.chain().focus().unsetAllMarks().run()
    },
    toggleBulletList() {
      this.editor.chain().focus().toggleBulletList().run()
    },
    toggleOrderedList() {
      this.editor.chain().focus().toggleOrderedList().run()
    },
    undo() {
      this.editor.chain().focus().undo().run()
    },
    redo() {
      this.editor.chain().focus().redo().run()
    },
    toogleHeading(level) {
      this.editor.chain().focus().toggleHeading({ level }).run()
    },
    setHardBreak() {
      this.editor.chain().focus().setHardBreak().run()
    },
    toggleBlockquote() {
      this.editor.chain().focus().toggleBlockquote().run()
    },
    setHorizontalRule() {
      this.editor.chain().focus().setHorizontalRule().run()
    },
    async handleUpload(evt) {
      evt.preventDefault()
      const file = evt.target.files[0]
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        this.$message.error('Please upload JPG/PNG file only')
        return
      }
      if (file.size / 1024 / 1024 > 5) {
        this.$message.error('Please upload size smaller than 5MB only')
        return
      }

      const formData = new FormData()
      formData.append('path', file)

      try {
        const res = await this.$axios.post(this.imgUploadUrl, formData)

        const url = res.data.path
        this.editor.chain().focus().setImage({ src: url }).run()
      } catch (e) {
        this.$responseError(e.response)
      }
    },
    setLink() {
      const previousUrl = this.editor.getAttributes('link').href
      const url = window.prompt('URL', previousUrl)

      // cancelled
      if (url === null) {
        return
      }

      // empty
      if (url === '') {
        this.editor.chain().focus().extendMarkRange('link').unsetLink().run()
        return
      }

      // update link
      this.editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run()
    },
  },
}
</script>
<style lang="less" scoped>
.menu {
  padding: 12px;
  border-top: 1px solid lightgray;
  border-left: 1px solid lightgray;
  border-right: 1px solid lightgray;

  .ant-btn-group {
    margin-right: 8px;
  }

  .is-active {
    color: whitesmoke;
    background: purple;
  }

  .heading {
    .ant-btn {
      padding: 6px;
      font-weight: bold;
    }
  }
}
.editor {
  border: 1px solid lightgray;
  padding: 16px;

  ::v-deep.ProseMirror {
    &:focus {
      outline-width: 0;
    }

    blockquote {
      padding-left: 16px;
      border-left: 2px solid lightgray;
    }
    code {
      background-color: rgba(gray, 0.2);
      color: #616161;
      padding: 0 4px;
      font-family: monospace;
    }
    img {
      object-fit: contain;
      max-width: 100%;
      max-height: 100%;

      &.ProseMirror-selectednode {
        outline: 3px solid skyblue;
      }
    }
  }
}
</style>
